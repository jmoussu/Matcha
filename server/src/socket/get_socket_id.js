const online = require('./connect').online;


function get_socket_id(id) {
	const socket_id = Object.keys(online).find(index => online[index] == id)
	return socket_id;
}

module.exports = get_socket_id;
