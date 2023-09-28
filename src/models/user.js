const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Model = require('./model');
const pool = require('../db');

var transporter = nodemailer.createTransport({
	host: 'sandbox.smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: 'f8a86bd428a9ab',
		pass: 'a2fa08650456b7',
	},
});

class User extends Model {
	constructor(args) {
		super(args);
		this.tableName = 'users';
	}
	async findAndReturnUser(id = this.id) {
		try {
			const rows = await pool.execute(`SELECT * FROM ${this.tableName} WHERE id=${id}`);
			if (rows.length > 0) {
				return rows[0][0];
			}
		} catch (e) {
			return {};
		}
	}
	async loginToSystem(res) {}
	// async findByEmailAndSendEmail(email) {
	// 	try {
	// 		const rows = await pool.execute(`SELECT * FROM ${this.tableName} WHERE email="${email}"`);
	// 		console.log(rows, rows.length, rows[0][0]);
	// 		if (rows.length > 1 && rows[0][0]) {
	// 			const info = await transporter.sendMail({
	// 				from: '"Pupupu" <conner5@ethereal.email>', // sender address
	// 				to: `"Tutut" ${rows[0][0].email}`, // list of receivers
	// 				subject: 'Hello ✔', // Subject line
	// 				text: `Your password is ${rows[0][0].password}`, // plain text body
	// 				html: '<p><b>Hello</b> to myself!</p>',
	// 			});
	// 			return { status: 200, info };
	// 		}
	// 		return { status: 400, e: 'something went wrong' };
	// 		// rows[0][0].password
	// 	} catch (e) {
	// 		return { status: 400, e };
	// 	}
	// }
}
module.exports = User;
