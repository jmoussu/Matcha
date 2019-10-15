const online = require('./connect').online;


function get_online(id) {
	if (Object.keys(online).find(index => online[index] == id))
		return true;
	else
		return false;
}

module.exports = get_online;
