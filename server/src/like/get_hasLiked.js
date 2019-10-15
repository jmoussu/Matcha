const mysql_login = require('./../mysql_login');
const db = mysql_login.pool;

async function get_hasLiked(UserId, user_who_like) {
	let sql = "SELECT COUNT(*) as count FROM likes WHERE user = ? AND liked = ?";
	const inserts = [user_who_like, UserId];
	try {
		const res = await db.query(sql, inserts);
		if (res[0].count >= 1) {
			return 1; // liked
		}
		return 0; // not licked
	}
	catch (err) {
		// console.log('REQUEST get_hasLiked FAIL');
		return -1;
	}
}
module.exports = get_hasLiked;
