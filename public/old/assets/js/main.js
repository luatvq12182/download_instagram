const $ = document.querySelector.bind(document);
const listFolder = $('#listFolder');

const getRequest = async (endpoint) => {
	const res = await fetch(endpoint);

	const data = await res.json();

	return data;
};

const postRequest = async (endpoint, payload) => {
	const res = await fetch(endpoint, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await res.json();

	return data;
};

const getFolder = async () => {
	const res = await getRequest('/getFolders');

	listFolder.innerHTML = `
        ${res.data.map((folder) => {
            return `
                <li class='my-1'>
					<img src="./folder.png" alt="_folder" />
                    <span class='ms-1 me-2'>${folder}</span>
					<img 
						onclick="console.log(1);"
						src="./delete.png" 
						alt="_delete" 
						title='Xóa thư mục' />
                </li>
            `
        }).join('')}
    `;
};

const main = () => {
	getFolder();

	const btn = $('#btn');

	btn.addEventListener('click', async (e) => {
		e.preventDefault();

		const url = $('#url').value;
		const soluong = $('#soluong').value;
		const widthResize = $('#widthResize').value;
		const heighResize = $('#heighResize').value;

		const data = await postRequest('/download', {
			url,
			soluong,
			widthResize,
			heighResize,
		});

		alert(data.msg);
	});
};

main();

{/* <a class='text-decoration-none' href="./downloadFolder/${folder}">
						<img class='me-2' src="./download.png" alt="_download" title='Tải về' />
					</a>
					<img class='me-2 eye' src="./search.png" alt="_eye" title='Xem ảnh trong thư mục' /> */}