const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const pool = require('../db');
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statucCode, res) => {
	const token = signToken(user);

	res.status(statucCode).json({
		status: 'success',
		token,
	});
};

exports.register = catchAsync(async (req, res, next) => {
	const newUser = await new User({
		login: req.body.login,
		email: req.body.email,
		password: await bcrypt.hash(req.body.password, 12),
		role: req.body.role || 'user',
	}).save();
	createSendToken(newUser._id, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { login, password } = req.body;
	if (!login || !password) return next(new AppError('Please provide email and/or password'), 400);
	let rows;
	if (login.indexOf('@') === -1)
		rows = await pool.execute(`SELECT * FROM users WHERE login="${login}"`); // TODO make correct checker for email
	else rows = await pool.execute(`SELECT * FROM users WHERE email="${login}"`);
	if (rows[0][0] && (await bcrypt.compare(password, rows[0][0].password))) {
		return createSendToken(rows[0][0].id, 200, res);
	}
	return next(new AppError('Wrong login/password'), 400);
});
