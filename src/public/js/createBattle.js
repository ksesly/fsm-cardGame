function createBattle() {
	const myCreationBattle = document.querySelector('.create-battle');
	const div = myCreationBattle.appendChild(document.createElement('div'));
	div.className = 'div-button';
	const readyButton = div.appendChild(document.createElement('button'));
	readyButton.className = 'ready-button';
	readyButton.textContent = 'im ready';
	readyButton.id = "switchButton";
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

cancelButton.addEventListener("click", () => {
	location.replace("./lobby");
});

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

const switchBtn = document.getElementById('switchButton');
const counterElement = document.createElement('div');
switchBtn.addEventListener('click', () => {
	switchBtn.disabled = true;
	const socket = io.connect('http://localhost:3000');
	let roomNo, connection;
	let user;
	socket.emit('findingRoom', getAuthorizationCookie());

	socket.on('roomNumber', (data) => {
		roomNo = data.roomNo;
		connection = data.connection;
		console.log('Room no data', roomNo, connection);
	});
	
	socket.on('roomClosed', (dataObj) => {
		let countdown = 5;
		const countdownInterval = setInterval(() => {
		
			counterElement.className = 'counter';
			document.body.appendChild(counterElement);

			if (countdown <= 0) {
				clearInterval(countdownInterval);
				battle();
			} else {
				counterElement.textContent = countdown.toString();
				// readyButton.textContent = `I'm ready (${countdown}s)`;
				countdown--;
			}
			console.log(countdown);
			
		}, 1000);
		
		console.log('hello?');
		console.log(`I am ${connection === dataObj.first.connection ? dataObj.first.login : dataObj.second.login}`);
		console.log(
			`My opponent is ${connection === dataObj.first.connection ? dataObj.second.login : dataObj.first.login}`
		);
	});

});


function battle() {
    const myBattle = document.querySelector('.battle');
	counterElement.style.display = 'none'
	const createBattleSection = document.querySelector('.create-battle');
	const battleSection = document.querySelector('.battle');

	createBattleSection.style.display = 'none';
	battleSection.style.display = 'block';
	
	// const button = battleSection.appendChild(document.createElement('button'));
}

