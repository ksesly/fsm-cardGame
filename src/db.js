// const mysql = require('mysql2');
// const config = require('./config.json');

// const pool = mysql.createPool(config).promise();

// // const checkIt = async () => {
// // 	try {
// // 		const rows = await pool.query('SELECT * FROM heroes');
// // 		for (row of rows[0]) console.log(row['name']);
// // 		// console.log(rows[0]);
// // 	} catch (error) {
// // 		console.error('Error', error);
// // 	}
// // };

// // checkIt();

// module.exports = pool;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ucode_web', 'kslipko', 'securepass', {
	host: 'localhost',
	dialect: 'mysql',
});

const { User, Card, Table, CardOnTable, TableCard } = require('./models/models'); // Update the path as needed

const starWarsCards = [
	{
		image: 'https://facts.net/wp-content/uploads/2023/07/darth-vader-with-red-light-saber.jpg',
		title: 'Darth Vader',
		description: 'Sith Lord',
		cost: 5,
		damage: 8,
		defence: 6,
	},
	{
		image: 'https://static.tvtropes.org/pmwiki/pub/images/luke_the_hero_small.png',
		title: 'Luke Skywalker',
		description: 'Jedi Knight',
		cost: 4,
		damage: 7,
		defence: 5,
	},
	{
		image: 'https://i0.wp.com/beverlyhillsfilmfestival.com/wp-content/uploads/gun.jpeg?fit=672%2C1000&ssl=1',
		title: 'Princess Leia',
		description: 'Rebel Leader',
		cost: 3,
		damage: 6,
		defence: 4,
	},
];

async function addStarWarsCards() {
	try {
		await Card.bulkCreate(starWarsCards);
		console.log('Star Wars cards added to the database.');
	} catch (error) {
		console.error('Error adding Star Wars cards:', error);
	}
}

// sequelize
// 	.authenticate()
// 	.then(() => {
// 		console.log('Database connection has been established successfully.');
// 		addStarWarsCards();
// 	})
// 	.catch((error) => {
// 		console.error('Unable to connect to the database:', error);
// 	});

module.exports = {
	sequelize,
	User,
	Card,
	Table,
	CardOnTable,
	TableCard,
};
