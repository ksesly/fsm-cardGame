const socket = io.connect('http://localhost:3000');

const switchBtn = document.getElementById('switchButton');
let clientRoom;

socket.on('serverMsg', (data) => {
	console.log('Room no data');
	clientRoom = data;
});

socket.on('switchFromServer', () => {
	if (document.body.style.background === 'darkgray') {
		document.body.style.background = 'white';
	} else {
		document.body.style.background = 'darkgray';
	}
});

switchBtn.addEventListener('click', () => {
	console.log('tik');
	socket.emit('buttonPressed', clientRoom);
	socket.emit('clientToClient', 'Hello lox');
});
