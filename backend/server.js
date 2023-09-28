// console.log(process.env);
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });

let clientAmount = 0;

const server = app.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}`);
});
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});

const rooms = new Map();
let roomCounter = 1;
let queue = {};
io.on('connection', (socket) => {
	// console.log(socket);
	socket.on('findingRoom', () => {
		console.log('Trying to find Room');
		console.log(socket.rooms);
		// console.log(queue);
		// console.log(socket);
		// if (!queue[socket.id]) {
		// queue[socket.id] = Math.round(clientAmount / 2);
		clientAmount++;
		socket.join(Math.round(clientAmount / 2));
		console.log('ClientAmount ', clientAmount);
		console.log('Room no', Math.round(clientAmount / 2));
		socket.emit('serverMsg', Math.round(clientAmount / 2));
		// }
	});

	socket.on('buttonPressed', (clientRoom) => {
		console.log('buttonPressed ' + clientRoom);
		io.to(clientRoom).emit('switchFromServer');
	});

	socket.on('disconnect', () => {
		rooms.forEach((value, key) => {
			if (value.occupant === socket.id) {
				rooms.delete(key);
			}
		});
	});
});
