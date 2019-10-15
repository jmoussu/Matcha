const mysql_login = require('./mysql_login');
const db = mysql_login.pool;

async function get_user(UserId) {
	let sql = "SELECT * FROM `users` WHERE id = ?";
	try {
		const res = await db.query(sql, UserId);
		return res[0];
	}
	catch (err) {
		return -1;
	}
}


module.exports = get_user;
