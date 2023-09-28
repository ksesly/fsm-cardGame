const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const protected = async (req) => {
	if (req.headers.cookie.search(/authorization/) > 0) {
		req.headers['authorization'] = req.headers.cookie
			.slice(req.headers.cookie.search('authorization'))
			.replace('authorization=', '');
	}
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else return { status: false };
	if (!token) {
		return { status: false };
	}
	// Validate token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	let user = new User({ id: decoded.id });
	if (!user.find(decoded.id)) {
		return { status: false };
	}
	return { status: true, user: user };
};

module.exports = protected;
