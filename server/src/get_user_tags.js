const mysql_login = require('./mysql_login');
const db = mysql_login.pool;

// SELECT tag.id as id, tag FROM tag INNER JOIN tagging ON tag.id = tagging.id_tag INNER JOIN users ON tagging.id_user = users.id WHERE users.id = ?
async function select_tag(UserId) {
	let sql = "SELECT tag FROM tag INNER JOIN tagging ON tag.id = tagging.id_tag INNER JOIN users ON tagging.id_user = users.id WHERE users.id = ?";
	try {
		const res = await db.query(sql, UserId);
		return res.map((data) => data.tag);
	}
	catch (err) {
		return -1;
	}
}


module.exports = select_tag;
