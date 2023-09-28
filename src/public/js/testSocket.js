const socket = io.connect('http://localhost:3000');

const switchBtn = document.getElementById('switchButton');
let clientRoom;
socket.emit('findingRoom');

socket.on('serverMsg', (data) => {
	clientRoom = data;
	console.log('Room no data', clientRoom);
});

socket.on('switchFromServer', () => {
	if (document.body.style.background === 'darkgray') {
		document.body.style.background = 'white';
	} else {
		document.body.style.background = 'darkgray';
	}
});

switchBtn.addEventListener('click', () => {
	socket.emit('buttonPressed', clientRoom);
	socket.emit('clientToClient', 'Hello lox');
});
