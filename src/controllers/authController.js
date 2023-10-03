const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const AppError = require('../utils/appError');
const { User } = require('../db');

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
	const { login, email, password, role } = req.body;
	const hashedPassword = await bcrypt.hash(password, 12);
	const newUser = await User.create({
		login,
		email,
		password: hashedPassword,
		role: role || 'user',
	});
	createSendToken(newUser.id, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { login, password } = req.body;
	if (!login || !password) return next(new AppError('Please provide email and/or password', 400));
	const user = await User.findOne({
		where: {
			[Sequelize.Op.or]: [{ login }, { email: login }],
		},
	});

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return next(new AppError('Wrong login/password', 400));
	}

	createSendToken(user.id, 200, res);
});
