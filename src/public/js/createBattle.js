var socket;

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
	myDeck: [],
	cardsOnTable: [],
	tableId: 0,
};

const switchBtn = document.getElementById('switchButton');
const counterElement = document.createElement('div');
switchBtn.addEventListener('click', () => {
	switchBtn.disabled = true;
	socket = io.connect('http://localhost:3000');
	let roomNo, connection;

	socket.emit('findingRoom', getAuthorizationCookie());

	socket.on('roomNumber', (data) => {
		roomData.roomNo = data.roomNo;
		connection = data.connection;
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

	socket.on('roomClosed', async (table) => {
		roomData.tableId = table.id;
		roomData.users.firstPlayer.health = table.health_p1;
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
					roomData.users.secondPlayer.health = table.health_p2;
				}
			})
			.catch((err) => {
				console.error('pupupu', err);
			});

		// console.log(roomData.users);
		let countdown = 2;

		// may create a funct later

		await cardInHandPost();
		await cardInHandGet();

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
	counterElement.style.display = 'none';
	const createBattleSection = document.querySelector('.create-battle');
	const battleSection = document.querySelector('.battle');

	createBattleSection.style.display = 'none';
	battleSection.style.display = 'flex';

	// opponent

	const opponent = battleSection.appendChild(document.createElement('div'));
	opponent.className = 'opponent';

	const myOpponentLogin = opponent.appendChild(document.createElement('p'));
	myOpponentLogin.className = 'my-opponent-login-p';
	myOpponentLogin.textContent = roomData.users.secondPlayer.login;

	const opponentCards = opponent.appendChild(document.createElement('div'));
	opponentCards.className = 'opponent-cards-div';

	//playing board

	const playingBoard = battleSection.appendChild(document.createElement('div'));
	playingBoard.className = 'playing-board';

	const finishButton = playingBoard.appendChild(document.createElement('button'));
	finishButton.classList = 'finish-button';
	finishButton.textContent = 'finish';

	const opponentField = playingBoard.appendChild(document.createElement('div'));
	opponentField.className = 'opponent-field';
	const myField = playingBoard.appendChild(document.createElement('div'));
	myField.className = 'my-field';

	const me = battleSection.appendChild(document.createElement('div'));
	me.className = 'me';

	const myNameAndHealth = me.appendChild(document.createElement('div'));
	myNameAndHealth.className = 'name-and-health';
	const myLogin = myNameAndHealth.appendChild(document.createElement('p'));
	myLogin.className = 'my-login-p';
	myLogin.textContent = roomData.users.firstPlayer.login;
	const myHealth = myNameAndHealth.appendChild(document.createElement('p'));
	myHealth.className = 'my-health-p';
	myHealth.textContent = 'health: ' + roomData.users.firstPlayer.health;

	const myCards = me.appendChild(document.createElement('div'));
	myCards.className = 'my-cards-div';

	console.log('render card in hadn the first time', roomData.myDeck);
	console.log(roomData.myDeck);
	roomData.myDeck.forEach((i) => {
		const card = createCard(i);
		myCards.appendChild(card);
	});

	const myEnergy = me.appendChild(document.createElement('div'));
	myEnergy.className = 'my-energy-div';
	myEnergy.textContent = '';

	const cards = [...document.querySelectorAll('.card')];

	let isActive = false;
	let cardId = null;
	cards.forEach((card) => {
		card.addEventListener('click', () => {
			if (!isActive) {
				card.style.border = '5px solid red';
				isActive = true;
				myField.style.border = '5px solid red';
				// card.setAttribute('active', 'true');
				myField.addEventListener('click', async () => {
					if (isActive) {
						cardId = card.id * 1;

						await cardOnTablePost(cardId);
						socket.emit('render_table', roomData.roomNo);
						myField.innerHTML = '';
						card.remove();
						roomData.myDeck = await cardInHandGet();
						// roomData.myDeck.forEach(i => {
						// 	const card = createCard(i);
						// 	myCards.appendChild(card);
						// });

						// console.log(roomData.cardsOnTable);
						// roomData.cardsOnTable.forEach(i => {

						// 	console.log('render card on the table time', i);
						// 	// console.log(i);
						// 	// const card = createCard(i);

						// 	const card = document.createElement('div');
						// 	// card.id = i.Card.id;
						// 	card.className = 'card';
						// 	const title = card.appendChild(document.createElement('p'));
						// 	title.className = 'card-name';
						// 	title.textContent = i.Card.title;
						// 	const photo = card.appendChild(document.createElement('div'));
						// 	photo.style.backgroundImage = 'url(' + i.Card.image + ')';
						// 	photo.className = 'photo';
						// 	const description = card.appendChild(document.createElement('div'));
						// 	description.className = 'description';
						// 	description.textContent = i.Card.description;
						// 	const damage = card.appendChild(document.createElement('p'));
						// 	damage.className = 'damage';
						// 	damage.textContent = 'damage: ' + i.Card.damage;
						// 	const defence = card.appendChild(document.createElement('p'));
						// 	defence.className = 'defence';
						// 	defence.textContent = 'defence: ' + i.Card.defence;
						// 	const cost = card.appendChild(document.createElement('p'));
						// 	cost.className = 'cost';
						// 	cost.textContent = 'cost: ' + i.Card.cost;
						// 	// return card;

						// 	myField.appendChild(card);
						// });
					}
				});
			} else {
				card.style.border = 'none';
				isActive = false;
				myField.style.border = 'none';
				// card.setAttribute('active', 'false');
			}
		});
	});

	socket.on('render_table_from_server', async () => {
		roomData.cardsOnTable = await cardOnTableGet();
		let myCard = roomData.cardsOnTable.filter((card) => {
			return card.player_id === roomData.users.firstPlayer.id;
		});
		let enemyCard = roomData.cardsOnTable.filter((card) => {
			return card.player_id === roomData.users.secondPlayer.id;
		});
		myField.innerHTML = '';
		opponentField.innerHTML = '';

		myCard.forEach((i) => {
			// console.log('render card on the table time', i);
			// console.log(i);
			// const card = createCard(i);

			const card = document.createElement('div');
			// card.id = i.Card.id;
			card.className = 'card';
			const title = card.appendChild(document.createElement('p'));
			title.className = 'card-name';
			title.textContent = i.Card.title;
			const photo = card.appendChild(document.createElement('div'));
			photo.style.backgroundImage = 'url(' + i.Card.image + ')';
			photo.className = 'photo';
			const description = card.appendChild(document.createElement('div'));
			description.className = 'description';
			description.textContent = i.Card.description;
			const damage = card.appendChild(document.createElement('p'));
			damage.className = 'damage';
			damage.textContent = 'damage: ' + i.Card.damage;
			const defence = card.appendChild(document.createElement('p'));
			defence.className = 'defence';
			defence.textContent = 'defence: ' + i.Card.defence;
			const cost = card.appendChild(document.createElement('p'));
			cost.className = 'cost';
			cost.textContent = 'cost: ' + i.Card.cost;
			// return card;

			myField.appendChild(card);
		});
		enemyCard.forEach((i) => {
			// console.log('render card on the table time', i);
			// console.log(i);
			// const card = createCard(i);

			const card = document.createElement('div');
			// card.id = i.Card.id;
			card.className = 'card';
			const title = card.appendChild(document.createElement('p'));
			title.className = 'card-name';
			title.textContent = i.Card.title;
			const photo = card.appendChild(document.createElement('div'));
			photo.style.backgroundImage = 'url(' + i.Card.image + ')';
			photo.className = 'photo';
			const description = card.appendChild(document.createElement('div'));
			description.className = 'description';
			description.textContent = i.Card.description;
			const damage = card.appendChild(document.createElement('p'));
			damage.className = 'damage';
			damage.textContent = 'damage: ' + i.Card.damage;
			const defence = card.appendChild(document.createElement('p'));
			defence.className = 'defence';
			defence.textContent = 'defence: ' + i.Card.defence;
			const cost = card.appendChild(document.createElement('p'));
			cost.className = 'cost';
			cost.textContent = 'cost: ' + i.Card.cost;
			// return card;

			opponentField.appendChild(card);
		});
	});
}

function createCard(i) {
	const card = document.createElement('div');
	card.id = i.id;
	card.className = 'card';
	const title = card.appendChild(document.createElement('p'));
	title.className = 'card-name';
	title.textContent = i.title;
	const photo = card.appendChild(document.createElement('div'));
	photo.style.backgroundImage = 'url(' + i.image + ')';
	photo.className = 'photo';
	const description = card.appendChild(document.createElement('div'));
	description.className = 'description';
	description.textContent = i.description;
	const damage = card.appendChild(document.createElement('p'));
	damage.className = 'damage';
	damage.textContent = 'damage: ' + i.damage;
	const defence = card.appendChild(document.createElement('p'));
	defence.className = 'defence';
	defence.textContent = 'defence: ' + i.defence;
	const cost = card.appendChild(document.createElement('p'));
	cost.className = 'cost';
	cost.textContent = 'cost: ' + i.cost;
	return card;
}

async function cardOnTableGet() {
	const response = await fetch(`http://127.0.0.1:3000/cardsOnTable/${roomData.tableId}`, {
		method: 'GET',
	});
	const json = await response.json();
	return (roomData.cardsOnTable = JSON.parse(JSON.stringify(json)));
}

async function cardOnTablePost(id) {
	console.log(roomData.tableId, id, 'PUPUPUPUPUPUP');
	const response = await fetch(`http://127.0.0.1:3000/cardsOnTable/${roomData.tableId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ cardId: id }),
	});
}

async function cardInHandGet() {
	const response = await fetch(`http://127.0.0.1:3000/getHandCard/${roomData.tableId}`, {
		method: 'GET',
	});

	const json = await response.json();
	return (roomData.myDeck = JSON.parse(JSON.stringify(json)));
}
async function cardInHandPost() {
	const res = await fetch(`http://127.0.0.1:3000/getHandCard/${roomData.tableId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ numberOfCardsToAdd: 3 }),
	});
}
