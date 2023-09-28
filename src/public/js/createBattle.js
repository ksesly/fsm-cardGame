function createBattle() {
	const myCreationBattle = document.querySelector('.create-battle');
	const div = myCreationBattle.appendChild(document.createElement('div'));
	div.className = 'div-button';
	const readyButton = div.appendChild(document.createElement('button'));
	readyButton.className = 'ready-button';
	readyButton.textContent = 'im ready';
	const cancelButton = div.appendChild(document.createElement('button'));
	cancelButton.className = 'cancel-button';
	cancelButton.textContent = 'nonono, cancel';
}

createBattle();

function getAuthorizationCookie() {
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === 'authorization') {
			return decodeURIComponent(value).replace('Bearer ', '');
		}
	}
	return null; // Cookie not found
}

const socket = io.connect('http://localhost:3000');

const switchBtn = document.getElementById('switchButton');
let roomNo, connection;
let user;
socket.emit('findingRoom', getAuthorizationCookie());

socket.on('roomNumber', (data) => {
	roomNo = data.roomNo;
	connection = data.connection;
	console.log('Room no data', roomNo, connection);
});

socket.on('roomClosed', (dataObj) => {
	console.log('hello?');
	console.log(`I am ${connection === dataObj.first.connection ? dataObj.first.login : dataObj.second.login}`);
	console.log(
		`My opponent is ${connection === dataObj.first.connection ? dataObj.second.login : dataObj.first.login}`
	);
});
socket.on('switchFromServer', () => {
	if (document.body.style.background === 'darkgray') {
		document.body.style.background = 'white';
	} else {
		document.body.style.background = 'darkgray';
	}
});

// switchBtn.addEventListener('click', () => {
// 	socket.emit('buttonPressed', roomNo);
// 	socket.emit('clientToClient', 'Hello lox');
// });
