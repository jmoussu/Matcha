const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');


router.post('/', async (req, res) => {

	const UserId = await jwt.verifyUser(req.headers['authorization']);
	
	async function set_read() {
		let sql = "UPDATE notifications SET valide = 0 WHERE id_take = ?";
		try {
			await db.query(sql, UserId);
		}
		catch (err) {
			// console.log('REQUEST set_read FAIL');
			return 1;
		}
	}

	async function set_read_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (await set_read() == 1)
			return 2;
		return 0;
	}

	let err = await set_read_main();
	if (err == 0) {
		res.status(200).json({ message: "set_read (notifications) sucsess" });
		// console.log('OK 200 : set_read (notifications) sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		// console.log("Internal Server Error 500: request set_read (notifications) fail");
		res.status(500).json({ message: "Internal Server Error 500: request set_read (notifications) fail" });
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
