const download = require('image-downloader');
const config = require('../config');

const downloadImgBySrc = async (src, dest) => {
    const destDefault = config.ROOT_PATH + '/download'

    await download.image({
        url: src,
        dest: dest || destDefault
    });
};

module.exports = downloadImgBySrc;