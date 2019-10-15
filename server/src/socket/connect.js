const io = require('./socket').getio();
const jwt = require('./../jwt/jwt');
const last_visit = require('../last_visit');
const online = new Object;

function io_connect() {

	io.on('connection', function (socket) {
		socket.on('connected', async function (data) {
			const id = await jwt.verifyUser(data.id);
			if (id <= 0)
				return;
			online[socket.id] = id;
			socket.broadcast.emit('online', online[socket.id]);
			last_visit(id);
			// console.log("USER " + id + " IS CONECTED");
		});

		socket.on('disconnect', function () {
			socket.broadcast.emit('offline', online[socket.id]);
			// console.log("USER " + online[socket.id] + " IS DISCONECTED");
			delete online[socket.id];
		});

		socket.on('disconnected', function () {
			socket.broadcast.emit('offline', online[socket.id]);
			// console.log("USER " + online[socket.id] + " IS DISCONECTED");
			delete online[socket.id];
		});
	});


}

module.exports.io_connect = io_connect;
module.exports.online = online;
