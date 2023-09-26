// console.log(process.env);
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });

let clientAmount = 1;

const server = app.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}`);
});
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});
io.on('connection', (socket) => {
	console.log('client connected');
	clientAmount++;
	socket.join(Math.round(clientAmount / 2));

	socket.emit('serverMsg', Math.round(clientAmount / 2));

	socket.on('buttonPressed', (clientRoom) => {
		console.log('buttonPressed');
		io.to(clientRoom).emit('switchFromServer');
	});
});
module.exports = server;
