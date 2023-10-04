const express = require('express');
const authController = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { User } = require('../db');
router
	.route('/register')
	.post(authController.register)
	.get((req, res) => {
		res.sendFile('signUp.html', { root: './public/views/' });
	});
router
	.route('/login')
	.post(authController.login)
	.get((req, res) => {
		res.sendFile('signIn.html', { root: './public/views/' });
	});
router.route('/getUser/:id').get(
	catchAsync(async (req, res) => {
		const userId = req.params.id;

		const user = await User.findByPk(userId, {
			attributes: { exclude: ['password'] },
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json( user );
	})
);
module.exports = router;
