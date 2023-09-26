const mysql = require('mysql2');
const config = require('./config.json');

const pool = mysql.createPool(config).promise();

// const checkIt = async () => {
// 	try {
// 		const rows = await pool.query('SELECT * FROM heroes');
// 		for (row of rows[0]) console.log(row['name']);
// 		// console.log(rows[0]);
// 	} catch (error) {
// 		console.error('Error', error);
// 	}
// };

// checkIt();

module.exports = pool;
