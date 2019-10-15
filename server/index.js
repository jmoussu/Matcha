// Imports
const express = require('express');
const server = express();
const socket = require('http').Server(server);
const io = require('./src/socket/socket').init(socket);
require('./src/socket/connect').io_connect();
server.set('socketio', io);

// enable core
server.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

//Configure routes
server.use('/', require('./routes/routes.js'));


//Syntax Error
server.use(function (error, req, res, next) {
	if (error instanceof SyntaxError) {
		// console.error('Bad request 400 : The request had bad syntax (index)');
		res.status(400).json({ message: 'Bad request 400 : The request had bad syntax' });
		throw error;
	} else {
		next();
	}
});

// Launch server
socket.listen(3001, function () {
	console.log('Server is listening');
});
