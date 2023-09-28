const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const User = require('./models/user');
const protected = require('./protected');

const userRouter = require('./routes/userRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');

app.use(express.static(__dirname + '/public/'));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/users', userRouter);
app.use(lobbyRoutes);
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
