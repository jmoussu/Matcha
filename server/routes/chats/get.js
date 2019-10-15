const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');
const get_online = require('../../src/socket/online');

router.use(express.json());

router.get('/:id_profil', async (req, res) => {
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const id_profil = req.params.id_profil;
	let res_get_chats = await get_chats();

	async function get_chats() {
		const sql = "SELECT chats.id, author, message, firstname FROM chats INNER JOIN users ON users.id = author WHERE author = ? AND receiver = ? OR receiver = ? AND author = ? ORDER BY TIME ASC"; // inerjoin user to get name 
		const inserts = [UserId, id_profil, UserId, id_profil];
		try {
			return await db.query(sql, inserts);
		}
		catch (error) {
			return -1;
		}
	}

	async function get_path() {
		const sql = "SELECT path FROM pics WHERE id_user = ? AND avatar = 1"; // inerjoin user to get name 
		try {
			const res_path = await db.query(sql, id_profil);
			return res_path[0].path;
		}
		catch (error) {
			// console.log( "get chat get path sql error");
			return null;
		}
	}

	async function add_online(result) {
		return await Promise.all(result.map(async (x) => {
			try {
				x.online = await get_online(x.author)
				return x;
			}
			catch (error) {
				// console.log("add_online get chats error");
				return 1;
			}
		}
		))
	}

	async function get_chats_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!(!!id_profil))
			return 2; // 400 
		if (res_get_chats == -1)
			return 5;
		res_get_chats = await add_online(res_get_chats);
		if (res_get_chats == 1)
			return 5;
		
		return 0;
	}

	const err = await get_chats_main();
	if (err == 0) {
		res.status(200).json({ result: res_get_chats, path: await get_path() });
		// console.log('OK 200 : get chat sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : get chats fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : get chats fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 5) {
		// console.log("Internal Server Error 500: sql request fail");
		res.status(500).json({ message: "Internal Server Error 500: sql request fail" });
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
