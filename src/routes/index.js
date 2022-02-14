const router = require('express').Router();
const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const child_process = require('child_process');
const Util = require('../utils');
const config = require('../config');

router.get('/getFolders', (_req, res) => {
	fs.readdir(config.ROOT_PATH + '/download', (err, files) => {
		if (err) {
			res.json({
				status: 'Error',
				msg: err,
			});
		} else {
			res.json({
				status: 'Success',
				data: files,
			});
		}
	});
});

router.get('/getFiles/:dir', (req, res) => {
	const { dir } = req.params;

	fs.readdir(config.ROOT_PATH + '/download/' + dir, (err, files) => {
		if (err) {
			res.json({
				status: 'Error',
				msg: err,
			});
		} else {
			res.json({
				status: 'Success',
				data: files,
			});
		}
	});
});

router.get('/downloadFolder/:dir', (req, res) => {
	const { dir } = req.params;
	let cmd, cwd, oldPath, newPath;

	if (dir === 'download_full') {
		cmd = `zip -r img_instagrams *`;
		cwd = config.ROOT_PATH + '/download';
		oldPath = config.ROOT_PATH + '/download/img_instagrams.zip';
		newPath = config.ROOT_PATH + '/zip/img_instagrams.zip';
	} else {
		cmd = `zip -r ${dir} *`;
		cwd = config.ROOT_PATH + '/download/' + dir;
		oldPath = config.ROOT_PATH + '/download/' + dir + `/${dir}.zip`;
		newPath = config.ROOT_PATH + '/zip/' + `${dir}.zip`;
	}

	child_process.execSync(cmd, {
		cwd: cwd,
	});

	fs.rename(oldPath, newPath, (err) => {
		if (err) {
			res.json({
				msg: 'Error',
				err: err,
			});
		} else {
			res.download(newPath);
		}
	});
});

router.get('/deleteDir/:dir', (req, res) => {
	const { dir } = req.params;

	fs.rmSync(config.ROOT_PATH + '/download/' + dir, { recursive: true, force: true });

	res.json({
		status: 'Success'
	});
});

const validate = (req, res, next) => {
	const { url, soluong, widthResize, heighResize } = req.body;

	if (!url || !soluong) {
		res.status(400).json({
			msg: 'Thiếu url + số lượng ảnh cần tải!',
		});
	} else {
		next();
	}
};

const convertStringToNumber = (req, res, next) => {
	const { soluong, widthResize, heighResize } = req.body;

	if (typeof soluong === 'string') {
		req.body.soluong = Number(soluong);
	}

	if (typeof widthResize === 'string') {
		req.body.widthResize = Number(widthResize);
	}

	if (typeof heighResize === 'string') {
		req.body.heighResize = Number(heighResize);
	}

	next();
};

router.get('/', (_req, res) => {
	res.sendFile('index.html');
});

router.post('/download', validate, convertStringToNumber, async (req, res) => {
	try {
		const { url, soluong, widthResize, heighResize } = req.body;

		const { page, browser } = await Util.createPagePuppeteer(false);

		let srcs = [];
		let count = 0;

		await page.goto(url);

		while (srcs.length < soluong && count < 50) {
			count++;
			
			await Util.scrollPage(page);

			fetchSrcs = await page.evaluate(async () => {
				let imgs = document.querySelectorAll('.ySN3v img');

				imgs = [...imgs];

				return imgs.map((img) => img.src);
			});

			srcs = [...srcs, ...fetchSrcs];

			srcs = [...new Set(srcs)];
		}

		if (srcs.length > soluong) srcs.length = soluong;

		let folderSave = (
			config.ROOT_PATH +
			'/download/' +
			url.split('/')[3]
		).replaceAll('.', '');

		Util.makeDirSyncIfNotExist(folderSave);

		for (let i = 0; i < srcs.length; i++) {
			const res = await axios({
				method: 'GET',
				url: srcs[i],
				responseType: 'arraybuffer',
			});

			sharp(res.data)
				.resize(widthResize || 740, heighResize || 430)
				.toFile(folderSave + `/img-${i + 1}.jpg`, (err, info) => {
					if (err) {
						console.log(err);
					}
				});
		}

		await browser.close();

		res.json({
			msg: 'Download ảnh thành công!',
		});
	} catch (error) {
		console.log(error);

		res.json({
			status: 'Error',
			msg: error,
		});
	}
});

module.exports = router;
