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
const JWT_SECRET = 'Mishka_TishkaIsTheBestInTheWorldLolItNeedMoreCharactersAHAHAHAHA';
const JWT_EXPIRES_IN = '90d';

const signToken = (id) => {
	return jwt.sign({ id }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (id, statucCode, res) => {
	const token = signToken(id);
	res.status(statucCode).json({
		status: 'success',
		token,
	});
};

class User extends Model {
	constructor(args) {
		super(args);
		this.tableName = 'users';
	}
	async loginToSystem(res) {
		try {
			const rows = await pool.execute(`SELECT * FROM ${this.tableName} WHERE login="${this.login}"`);
			if (rows.length > 0) {
				return createAndSendToken(rows[0][0].id, 301, res);
			}
		} catch (e) {
			throw e;
		}
	}
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
