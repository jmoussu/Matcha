const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');
const new_notif = require('../../src/notification/new_notif');
const change_score = require('../../src/change_score');

router.use(express.json());

router.post('/', async (req, res) => {
	const io = req.app.get('socketio');
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const id_profil = req.body.id_profil;
	

	async function create_tables() {
		const sql = "CREATE TABLE IF NOT EXISTS likes(id int(11) NOT NULL AUTO_INCREMENT, user int(11) NOT NULL, liked INT(11) NOT NULL, time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, primary key (id))";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_tables (likes) FAIL');
			return 1;
		}
		const sql2 = "CREATE TABLE IF NOT EXISTS matchs(id int(11) NOT NULL AUTO_INCREMENT, user1 int(11) NOT NULL, user2 INT(11) NOT NULL, primary key (id))";
		try {
			await db.query(sql2);
		}
		catch (err) {
			// console.log('REQUEST create_tables (matchs) FAIL');
			return 1;
		}
	}

	async function allow_like() {
		const sql = "SELECT COUNT(*) as count FROM likes WHERE user = ? AND liked = ?";
		const inserts = [UserId, id_profil];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 1) {
				return 1;
			}
		}
		catch (err) {
			// console.log('REQUEST allow_like FAIL');
			return 2;
		}
		const sql2 = "SELECT COUNT(*) as count FROM pics WHERE id_user = ?"
		try {
			const res = await db.query(sql2, UserId);
			if (res[0].count == 0) {
				return 3;
			}
		}
		catch (err) {
			// console.log('REQUEST allow_like FAIL');
			return 2;
		}
	}

	async function like_or_match() {
		const sql = "SELECT COUNT(*) as count FROM likes WHERE user = ? AND liked = ?";
		const inserts = [id_profil, UserId];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 1) {
				return 1; // match
			}
			return 0; // like
		}
		catch (err) {
			// console.log('REQUEST like_or_match FAIL');
			return 2;
		}
	}

	async function add_like() {
		const sql = "INSERT INTO likes (user, liked) VALUES (?, ?)";
		const inserts = [UserId, id_profil];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST add_like FAIL');
			return 1;
		}
	}

	async function add_match() {
		let sql = "INSERT INTO matchs (user1, user2) VALUES (?, ?)";
		const inserts = [UserId, id_profil];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST add_match FAIL');
			return 1; // 500
		}
	}

	async function add_like_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!(!!id_profil))
			return 2; // 400
		if (await create_tables() === 1)
			return 3; // 500
		if (UserId == id_profil)
			return 4 // 401 can't add self like 
		const res_allow_like = await allow_like();
		if (res_allow_like == 1)
			return 5 // 401 allready liked
		if (res_allow_like == 3)
			return 6 // 401 You cant like you must add a pics before.
		if (res_allow_like == 2)
			return 3 // 500 REQUEST allow_like FAIL
		const res_like_or_match = await like_or_match();
		if (res_like_or_match == 2)
			return 3; // 500
		if (res_like_or_match == 1 || res_like_or_match == 0 ) {
			if (await add_like() == 1)
				return 3;
		}
		if (res_like_or_match == 1){
			if (await add_match() == 1)
				return 3;
			new_notif(UserId, id_profil, 2, io) // match
		}
		else if (res_like_or_match == 0)
			new_notif(UserId, id_profil, 1, io) // like
		change_score(1, id_profil);
		return 0;
	}

	let err = await add_like_main();
	if (err == 0) {
		res.status(200).json({ message: "add like sucsess" });
		// console.log('OK 200 : add like sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : add like fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : add like fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log("Internal Server Error 500: sql request fail");
		res.status(500).json({ message: "Internal Server Error 500: sql request fail" });
		return;
	}
	else if (err == 4) {
		// console.log("Unauthorized 401 : can't add self like ");
		res.status(401).json({ message: "can't add self like" });
		return;
	}
	else if (err == 5) {
		// console.log("Unauthorized 401 : Allready liked ");
		res.status(401).json({ message: "Allready liked" });
		return;
	}
	else if (err == 6) {
		// console.log("You cant like you must add a pics before");
		res.status(401).json({ message: "You cant like you must add a pics before" });
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
		return;
	}
});

module.exports = router;
