const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const protected = require('./protected');
const userRouter = require('./routes/userRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');
const tableRouter = require('./routes/tableRoutes');
const atackRoutes = require('./routes/atackRoutes');
app.use(express.static(__dirname + '/public/'));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('', userRouter);
app.use('', tableRouter);
app.use('', atackRoutes);

app.route('/lobby').get(protected, (req, res) => {
	res.sendFile('lobby.html', { root: './public/views/' });
});
app.route('/exit').get(protected, (req, res) => {
	res.sendFile('exit.html', { root: './public/views/' });
});
app.route('/settings').get(protected, (req, res) => {
	res.sendFile('settings.html', { root: './public/views/' });
});
app.route('/tutorial').get(protected, (req, res) => {
	res.sendFile('tutorial.html', { root: './public/views/' });
});

app.route('/createBattle').get(protected, (req, res) => {
	res.sendFile('createBattle.html', { root: './public/views/' });
});

// app.route('/').get((req, res) => {
// 	res.end('Hello World!');
// });
//
app.all('*', (req, res) => {
	if (req.headers.cookie && req.headers.cookie.search(/authorization/) >= 0) {
		req.headers['authorization'] = req.headers.cookie
			.slice(req.headers.cookie.search('authorization'))
			.replace('authorization=', '');
	}
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		res.redirect('/login');
	}
	res.redirect('/lobby');
});

module.exports = app;
