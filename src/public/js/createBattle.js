function createBattle() {
	const myCreationBattle = document.querySelector('.create-battle');
	const div = myCreationBattle.appendChild(document.createElement('div'));
	div.className = 'div-button';
	const readyButton = div.appendChild(document.createElement('button'));
	readyButton.className = 'ready-button';
	readyButton.textContent = 'im ready';
	readyButton.id = 'switchButton';
	const cancelButton = myCreationBattle.appendChild(document.createElement('button'));
	cancelButton.className = 'cancel-button';
	cancelButton.textContent = 'nonono, cancel';

	const counter = document.createElement('div');
	counter.className = 'counter';
	counter.id = 'counter';
	counter.textContent = '';
	myCreationBattle.insertBefore(counter, div);
}

createBattle();

const cancelButton = document.querySelector('.cancel-button');

cancelButton.addEventListener('click', () => {
	location.replace('./lobby');
});

function getAuthorizationCookie() {
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === 'authorization') {
			return decodeURIComponent(value).replace('Bearer ', '');
		}
	}
	return null;
}

let roomData = {
	roomNo: null,
	connection: null,
	users: {
		firstPlayer: {
			id: null,
			login: null,
			health: null,
		},
		secondPlayer: {
			id: null,
			login: null,
			health: null,
		},
	},
};

const switchBtn = document.getElementById('switchButton');
const counterElement = document.createElement('div');
switchBtn.addEventListener('click', () => {
	switchBtn.disabled = true;
	const socket = io.connect('http://localhost:3000');
	let roomNo, connection, id;
	let user;
	socket.emit('findingRoom', getAuthorizationCookie());

	socket.on('roomNumber', (data) => {
		roomNo = data.roomNo;
		connection = data.connection;
		console.log(1);
		fetch(`http://127.0.0.1:3000/getUser/${data.id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((value) => {
				roomData.users.firstPlayer.id = value.id;
				roomData.users.firstPlayer.login = value.login;
			})
			.catch((err) => {
				console.error('pupupu', err);
			});

		console.log('Room no data', roomNo, connection);
	});

	socket.on('roomClosed', (table) => {
		let p = roomData.users.firstPlayer.id === table.player_1 ? table.player_2 : table.player_1;
		const url = `http://127.0.0.1:3000/getUser/${p}`;
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				if (
					roomData.users.secondPlayer.id === null &&
					data.login !== roomData.users.firstPlayer.login &&
					data.id !== roomData.users.firstPlayer.id
				) {
					roomData.users.secondPlayer.id = data.id;
					roomData.users.secondPlayer.login = data.login;
				}
			})
			.catch((err) => {
				console.error('pupupu', err);
			});

		console.log(roomData.users);
		let countdown = 5;
		fetch(`https://127.0.0.1:3000/getHandCard/${table.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ numberOfCardsToAdd: 3 }),
		});
		fetch(`https://127.0.0.1:3000/getHandCard/${table.id}`, {
			method: 'GET',
		});
		const countdownInterval = setInterval(() => {
			counterElement.className = 'counter';
			document.body.appendChild(counterElement);
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				battle();
			} else {
				counterElement.textContent = countdown.toString();
				countdown--;
			}
			console.log(countdown);
		}, 1000);
	});
});

function battle() {
	const myBattle = document.querySelector('.battle');
	counterElement.style.display = 'none';
	const createBattleSection = document.querySelector('.create-battle');
	const battleSection = document.querySelector('.battle');

	createBattleSection.style.display = 'none';
	battleSection.style.display = 'flex';

	const opponent = battleSection.appendChild(document.createElement('div'));
	opponent.className = 'opponent';

	const myOpponentLogin = opponent.appendChild(document.createElement('p'));
	myOpponentLogin.className = 'my-opponent-login-p';
	myOpponentLogin.textContent = roomData.users.secondPlayer.login;

	const playingBoard = battleSection.appendChild(document.createElement('div'));
	playingBoard.className = 'playing-board';
	const me = battleSection.appendChild(document.createElement('div'));
	me.className = 'me';

	const myLogin = me.appendChild(document.createElement('p'));
	myLogin.className = 'my-login-p';
	myLogin.textContent = roomData.users.firstPlayer.login;
}
