const express = require('express');
const protected = require('../protected');

const router = express.Router();

router.route('/lobby').get(protected, (req, res) => {
	res.sendFile('lobby.html', { root: './public/views/' });
});
