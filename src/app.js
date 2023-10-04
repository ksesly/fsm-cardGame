const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const protected = require('./protected');
const userRouter = require('./routes/userRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');
const tableRouter = require('./routes/tableRoutes');
app.use(express.static(__dirname + '/public/'));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('', userRouter);
app.use('', tableRouter);

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
// app.all('*', (req, res) => {
// 	console.log(req.url);
// 	res.render(__dirname + '/views/error.html', {
// 		error: `Can't find ${req.originalUrl} on this server :# Please use only /login /register /homepage /reminder`,
// 	});
// });

module.exports = app;
