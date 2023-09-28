const express = require('express');
const authController = require('../controllers/authController.js');

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
		res.sendFile(__dirname + '/../public/views/signIn.html');
	});

module.exports = router;
