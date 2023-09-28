const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const protected = async (req, res, next) => {
	if (req.headers.cookie.search(/authorization/) > 0) {
		req.headers['authorization'] = req.headers.cookie
			.slice(req.headers.cookie.search('authorization'))
			.replace('authorization=', '');
	}
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new AppError('You are not logged in bro :(', 401));
	}
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const freshUser = new User({ id: decoded.id });
	await user.find(decoded.id);

	if (!user.login) return next(new AppError('This user was deleted', 401));

	// if (freshUser.changedPasswordAfter(decoded.iat))
	// 	return next(new AppError('User changed password. Please log in again.', 401));

	req.user = freshUser;
	next();
};

module.exports = protected;
