const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const User = require('./models/user');
const protected = require('./protected');

app.use(express.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/style.css', (req, res) => {
// 	res.sendFile(__dirname + '/public/style.css');
// });
app.route('/').get((req, res) => {
	res.end('Hello World!');
});

app.all('*', (req, res) => {
	res.render(__dirname + '/views/error.html', {
		error: `Can't find ${req.originalUrl} on this server :# Please use only /login /register /homepage /reminder`,
	});
});

module.exports = app;
