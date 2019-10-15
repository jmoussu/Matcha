const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');
const new_notif = require('../../src/notification/new_notif');

router.use(express.json());

router.post('/', async (req, res) => {
	
	const io = req.app.get('socketio');
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const id_profil = req.body.id_profil;

	async function create_tables() {
		let sql = "CREATE TABLE IF NOT EXISTS visits(id int(11) NOT NULL AUTO_INCREMENT, visitor int(11) NOT NULL, visited INT(11) NOT NULL, time bigint(11) NOT NULL, primary key (id))";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_tables (visits) FAIL');
			return 1;
		}
	}
	async function allow_visit() {
		let sql = "SELECT time FROM visits WHERE visitor = ? AND visited = ? ORDER BY time DESC LIMIT 1";
		const inserts = [UserId, id_profil];
		try {
			const res = await db.query(sql, inserts);
			if (!!res[0]) {
				if (res[0].time + 3600000 > Date.now())
					return 1;
			}
		}
		catch (err) {
			// console.log('REQUEST allow_visit FAIL');
			return 2;
		}
	}

	async function add_visit() {
		let sql = "INSERT INTO visits (visitor, visited, time) VALUES (?, ?, ?)";
		const ts = Date.now();
		const inserts = [UserId, id_profil, ts];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST add_visit FAIL');
			return 1;
		}
	}

	async function add_visit_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!(!!id_profil))
			return 2; // 400
		if (await create_tables() === 1)
			return 3; // 500
		if (UserId == id_profil)
			return 4 // 401 can't add self visit 
		const res_allow_visit = await allow_visit();
		if (res_allow_visit == 1)
			return 5 // 401 antispam visit
		if (res_allow_visit == 2)
			return 6 // 500 REQUEST allow_visit FAIL
		if (await add_visit() == 1)
			return 7; // 500 add visit fail
		await new_notif(UserId, id_profil, 0, io) // match
		return 0;
	}

	let err = await add_visit_main();
	if (err == 0) {
		res.status(200).json({ message: "add visits sucsess" });
		// console.log('OK 200 : add visits sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : add visits fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : add visits fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log("Internal Server Error 500: request create table fail");
		res.status(500).json({ message: "Internal Server Error 500: request create table fail" });
	}
	else if (err == 4) {
		// console.log("OK 200: can't add self visit ");
		res.status(200).json({ message: "can't add self visit" });
	}
	else if (err == 5) {
		// console.log("OK 200 : antispam visit ");
		res.status(200).json({ message: "antispam visit" });
	}
	else if (err == 6) {
		// console.log("Internal Server Error 500: request allow_visit FAIL");
		res.status(500).json({ message: "Internal Server Error 500: request allow_visit FAIL" });
	}
	else if (err == 7) {
		// console.log("Internal Server Error 500: request add visit fail");
		res.status(500).json({ message: "Internal Server Error 500: request add visit fail" });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
