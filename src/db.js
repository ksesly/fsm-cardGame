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

sequelize
	.authenticate()
	.then(() => {
		console.log('Database connection has been established successfully.');
	})
	.catch((error) => {
		console.error('Unable to connect to the database:', error);
	});

module.exports = {
	sequelize,
	User,
	Card,
	Table,
	CardOnTable,
	TableCard,
};
