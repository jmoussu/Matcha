const mysql_login = require('./mysql_login');
const db = mysql_login.pool;

async function last_visit(id) {
	const sql = "UPDATE users SET last_visit = CURRENT_TIMESTAMP WHERE id = ?";
	try {
		await db.query(sql, id)
	}
	catch (err) {
		// console.log("last_visit update fail");
	}
}

module.exports = last_visit;
