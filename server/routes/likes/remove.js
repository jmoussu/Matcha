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

	async function allow_remove() {
		let sql = "SELECT COUNT(*) as count FROM likes WHERE user = ? AND liked = ?";
		const inserts = [UserId, id_profil];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count == 0 ) {
				return 1; //401
			}
		}
		catch (err) {
			// console.log('REQUEST allow_remove FAIL');
			return 2;
		}
	}

	async function like_or_match() {
		let sql = "SELECT COUNT(*) as count FROM likes WHERE user = ? AND liked = ?";
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
			return 2; // 500
		}
	}

	async function remove_like() {
		let sql = "DELETE FROM likes WHERE user = ? AND liked = ?";
		const inserts = [UserId, id_profil];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST remove_like FAIL');
			return 1;
		}
	}

	async function remove_match() {
		let sql = "DELETE FROM matchs WHERE user1 = ? AND user2 = ? OR user2 = ? AND user1 = ?";
		const inserts = [UserId, id_profil, UserId, id_profil];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST remove_match FAIL');
			return 1; // 500
		}
	}

	async function remove_like_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!(!!id_profil))
			return 2; // 400
		if (UserId == id_profil)
			return 2 // 401 can't try remove self like 
		const res_allow_remove = await allow_remove();
		if (res_allow_remove == 1)
			return 5 // 401 no like to remove
		if (res_allow_remove == 2)
			return 3 // 500 REQUEST FAIL
		const res_like_or_match = await like_or_match();
		if (res_like_or_match == 2)
			return 3; // 500
		if (res_like_or_match == 1 || res_like_or_match == 0 ) {
			if (await remove_like() == 1)
				return 3;
		}
		if (res_like_or_match == 1){
			if (await remove_match() == 1)
				return 3;
			// notification ?
			new_notif(UserId, id_profil, 3, io) // match
		}
		return 0;
	}

	let err = await remove_like_main();
	if (err == 0) {
		res.status(200).json({ message: "remove like sucsess" });
		// console.log('OK 200 : remove like sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : remove like fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : remove like fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log("Internal Server Error 500: sql request fail");
		res.status(500).json({ message: "Internal Server Error 500: sql request fail" });
	}
	else if (err == 5) {
		// console.log("Unauthorized 401 : No like to remove ");
		res.status(401).json({ message: "No like to remove" });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
