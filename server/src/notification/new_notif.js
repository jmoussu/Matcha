const mysql_login = require('./../mysql_login');
const db = mysql_login.pool;
const get_online = require('../socket/online');
const get_socket_id = require('../socket/get_socket_id');
const io = require('../socket/socket').getio

async function create_tables() {
	let sql = "CREATE TABLE IF NOT EXISTS notifications(id int(11) NOT NULL AUTO_INCREMENT, fullname VARCHAR(255) NOT NULL, id_give int(11) NOT NULL, id_take INT(11) NOT NULL, type int(11) NOT NULL, valide BOOLEAN default true, primary key (id))";
	try {
		await db.query(sql);
	}
	catch (err) {
		// console.log('REQUEST create_tables (notifications) FAIL');
		return 1;
	}
}

async function get_fullname(id) {
	let sql = "SELECT firstname, lastname FROM users WHERE id = ?";
	try {
		const fullname_obj = await db.query(sql, id);
		const fullname = `${fullname_obj[0].firstname} ${fullname_obj[0].lastname}`;
		return fullname;
	}
	catch (err) {
		// console.log('get_fullname fail');
		return 1;
	}
}

async function add_notif(fullname, id_give, id_take, type) {
	let sql = "INSERT INTO notifications (fullname, id_give, id_take, type) VALUES (?, ?, ?, ?)";
	const inserts = [fullname, id_give, id_take, type];
	try {
		const res = await db.query(sql, inserts);
		return(res.insertId);
	}
	catch (err) {
		// console.log('REQUEST ADD NOTIF FAIL');
		return -1;
	}
}

async function new_notif(id_give, id_take, type, io) {
	if (await create_tables() == 1)
		return 1;
	const fullname = await get_fullname(id_give);
	if (fullname == 1)
		return 1;
	const res_add_notif = await add_notif(fullname, id_give, id_take, type);
	if (res_add_notif == -1)
		return 1;
	if (await get_online(id_take) == true) {
		const obj_notif = {
			id: res_add_notif,
			fullname: fullname,
			id_give: id_give,
			id_take: id_take,
			type: type
		}
		const socket_id = await get_socket_id(id_take)
		if (socket_id) {
			io.to(socket_id).emit('notification', obj_notif);
		}
	}
}

module.exports = new_notif;
