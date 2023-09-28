const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

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

module.exports = router;
