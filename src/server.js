const { promisify } = require('util');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const jwt = require('jsonwebtoken');
const app = require('./app');

const { User, Table, Card } = require('./db');
const server = app.listen(process.env.PORT, () => {
	console.log(`App running on port 127.0.0.1:${process.env.PORT}`);
});

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});

const rooms = {};
let clientAmount = 1;

const even = (int) => {
	return int % 2 === 0;
};

io.on('connection', (socket) => {
	socket.on('findingRoom', async (token) => {
		try {
			const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
			const roomNo = Math.round(clientAmount / 2);
			const newUser = await User.findByPk(decoded.id);

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

			if (even(clientAmount) && clientAmount !== 0) {
				const newTable = await Table.create({
					player_1: rooms[roomNo].first.id,
					player_2: rooms[roomNo].second.id,
					move: Math.random() < 0.5 ? rooms[roomNo].first.id : rooms[roomNo].second.id,
				});
				const allCardIds = await Card.findAll({ attributes: ['id'] });

				await Promise.all(
					allCardIds.map(async (card) => {
						await TableCardDeck.create({
							table_id: newTable.id,
							card_id: card.id,
							player_id: newTable.player_1,
						});

						await TableCardDeck.create({
							table_id: newTable.id,
							card_id: card.id,
							player_id: newTable.player_2,
						});
					})
				);
				// Now, you can emit the 'roomClosed' event with the newTable's id
				io.to(roomNo).emit('roomClosed', newTable);

				// Delete the room from the local memory
				delete rooms[roomNo];
			}

			clientAmount++;
		} catch (error) {
			console.error('Error during findingRoom:', error);
		}
	});

	socket.on('buttonPressed', (clientRoom) => {
		console.log('buttonPressed ' + clientRoom);
		io.to(clientRoom).emit('switchFromServer');
	});
});
