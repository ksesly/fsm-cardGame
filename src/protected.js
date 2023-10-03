const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { User } = require('./db');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');

const protected = catchAsync(async (req, res, next) => {
	if (req.headers.cookie.search(/authorization/) >= 0) {
		req.headers['authorization'] = req.headers.cookie
			.slice(req.headers.cookie.search('authorization'))
			.replace('authorization=', '');
	}
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new AppError('You are not logged in', 401));
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const freshUser = await User.findByPk(decoded.id);
	// console.log('fresh USER  ', freshUser);
	if (!freshUser || !freshUser.login) {
		return next(new AppError('This user was deleted', 401));
	}

	req.user = freshUser;
	next();
});

module.exports = protected;
