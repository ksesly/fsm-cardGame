// console.log(process.env);
const dotenv = require('dotenv');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const app = require('./app');
const User = require('./models/user');
dotenv.config({ path: './config.env' });
let clientAmount = 1;

var rooms = {};
const even = (int) => {
	return int % 2 === 0;
};
const server = app.listen(process.env.PORT, () => {
	console.log(`App running on port 127.0.0.1:${process.env.PORT}`);
});
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});
// class Room {
// 	constructor(clientNo, clientId) {
// 		clientNo % 2 === 0 ? (this.firstClient = clientId) : (this.secondClient = clientId);
// 		this.roomId = Math.round(clientNo / 2);
// 	}
// }
io.on('connection', (socket) => {
	socket.on('findingRoom', async (token) => {
		// console.log(token + '!!!TOKEN GOT!!!!!!!');
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		let roomNo = Math.round(clientAmount / 2);
		let newUser = new User(decoded.id);
		await newUser.find(decoded.id);

		socket.join(roomNo);
		console.log(`clientNo ${clientAmount}, clientId ${decoded.id}`);
		console.log('Room no', roomNo);
		if (!even(clientAmount)) {
			rooms[roomNo] = {
				first: { id: decoded.id, login: newUser.login, connection: clientAmount },
				second: { id: null, login: null, connection: null },
			};
		} else {
			rooms[roomNo].second = { id: decoded.id, login: newUser.login, connection: clientAmount };
			console.log(rooms[roomNo]);
		}
		socket.emit('roomNumber', { roomNo, connection: clientAmount });
		// console.log(rooms[roomNo]);
		if (even(clientAmount) && clientAmount !== 0) io.to(roomNo).emit('roomClosed', rooms[roomNo]);
		clientAmount++;
	});

	socket.on('buttonPressed', (clientRoom) => {
		console.log('buttonPressed ' + clientRoom);
		io.to(clientRoom).emit('switchFromServer');
	});
});
