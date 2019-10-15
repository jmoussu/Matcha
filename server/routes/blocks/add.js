const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');

router.use(express.json());

router.post('/', async (req, res) => {

	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const id_profil = req.body.id_profil;
	

	async function create_tables() {
		let sql = "CREATE TABLE IF NOT EXISTS blocks(id int(11) NOT NULL AUTO_INCREMENT, user int(11) NOT NULL, blocked INT(11) NOT NULL, primary key (id))";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_tables (blocks) FAIL');
			return 1; // 500
		}
	}

	async function allow_block() {
		let sql = "SELECT COUNT(*) as count FROM blocks WHERE user = ? AND blocked = ?";
		const inserts = [UserId, id_profil];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 1) {
				return 1; // 401 ALREADY BLOCKED
			}
		}
		catch (err) {
			// console.log('REQUEST allow_block FAIL');
			return 2; // 500
		}
	}

	async function add_block() {
		let sql = "INSERT INTO blocks (user, blocked) VALUES (?, ?)";
		const inserts = [UserId, id_profil];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST add_block FAIL');
			return 1;
		}
	}

	async function add_block_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!(!!id_profil))
			return 2; // 400
		if (await create_tables() === 1)
			return 3; // 500
		if (UserId == id_profil)
			return 4 // 401 can't add self block 
		const res_allow_block = await allow_block();
		if (res_allow_block == 1)
			return 5 // 401 allready blocked
		if (res_allow_block == 2)
			return 3 // 500 REQUEST allow_block FAIL
		if (await add_block() == 1)
			return 3;
		return 0;
	}

	let err = await add_block_main();
	if (err == 0) {
		res.status(200).json({ message: "add block sucsess" });
		// console.log('OK 200 : add block sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : add block fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : add block fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log("Internal Server Error 500: sql request fail");
		res.status(500).json({ message: "Internal Server Error 500: sql request fail" });
	}
	else if (err == 4) {
		// console.log("Unauthorized 401 : can't add self block ");
		res.status(401).json({ message: "can't add self block" });
	}
	else if (err == 5) {
		// console.log("Unauthorized 401 : Allready Blocked ");
		res.status(401).json({ message: "Allready Blocked" });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
