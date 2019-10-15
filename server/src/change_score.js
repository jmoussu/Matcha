const mysql_login = require('./mysql_login');
const db = mysql_login.pool;

async function change_score(change, UserId) {
	let score;
	const sql = "SELECT score FROM users WHERE id = ?"
	try {
		score = await db.query(sql, UserId);
		score = score[0].score
	}
	catch (err) {
		// console.log('REQUEST GET score (change score) FAIL');
		return;
	}
	if (change != -1 && change != 1) {
		// console.log("Score change use -1 or +1");
		return;
	}
	score = score + change;
	if (score < 0)
		score = 0;
	if (score > 100)
		score = 100;
	const sql2 = "UPDATE users SET score = ? WHERE id = ?";
	const inserts2 = [score, UserId];
	try {
		score = await db.query(sql2, inserts2);
	}
	catch (err) {
		// console.log('REQUEST change score FAIL');
		return;
	}
}

module.exports = change_score;
