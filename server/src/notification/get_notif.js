const mysql_login = require('./../mysql_login');
const db = mysql_login.pool;

async function get_notif(id_take) {
	let sql = "SELECT * FROM notifications WHERE id_take = ? order by id DESC";
	try {
		return await db.query(sql, id_take);
	}
	catch (err) {
		// console.log('REQUEST GET NOTIF FAIL');
		return 1;
	}
}

module.exports = get_notif;
