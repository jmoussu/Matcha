const mysql_login = require('./mysql_login');
const db = mysql_login.pool;

async function get_pics(UserId) {
	let sql = "SELECT path, avatar FROM pics WHERE id_user = ?";
	try {
		const res = await db.query(sql, UserId);
		return res;
	}
	catch (err) {
		return -1;
	}
}
module.exports = get_pics;
