const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');
const new_notif = require('../../src/notification/new_notif');
const get_socket_id = require('../../src/socket/get_socket_id');
const get_online = require('../../src/socket/online');

router.use(express.json());

router.post('/', async (req, res) => {
	const io = req.app.get('socketio');
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const id_profil = req.body.id_profil;
	const message = req.body.message;
	let glob_res_add_chat = null;

	async function create_tables() {
		const sql = "CREATE TABLE IF NOT EXISTS chats(id int(11) NOT NULL AUTO_INCREMENT, author int(11) NOT NULL, receiver INT(11) NOT NULL, message VARCHAR(255) NOT NULL, time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, primary key (id))";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_tables (chats) FAIL');
			return 1;
		}
	}

	async function allow_chat() {
		const sql = "SELECT COUNT(*) as count FROM blocks WHERE user = ? AND blocked = ? OR blocked = ? AND user = ?";
		const inserts = [UserId, id_profil, UserId, id_profil]
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 1) {
				return 1; // block 401
			}
		}
		catch (err) {
			// console.log('REQUEST allow_chat (block) FAIL');
			return 3;
		}
		const sql2 = "SELECT COUNT(*) as count FROM matchs WHERE user1 = ? AND user2 = ? OR user2 = ? AND user1 = ?";
		try {
			const res = await db.query(sql2, inserts);
			if (res[0].count <= 0) {
				return 2; // 401 no match
			}
		}
		catch (err) {
			// console.log('REQUEST allow_chat (match) FAIL');
			return 3;
		}
		return 0;
	}

	async function add_chat() {
		const sql = "INSERT INTO chats (author, receiver, message) VALUES (?, ?, ?)";
		const inserts = [UserId, id_profil, message];
		try {
			return await db.query(sql, inserts);
		}
		catch (error) {
			return 3;
		}
	}

	async function add_chat_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!(!!id_profil || !(!!message)))
			return 2; // 400
		const res = await allow_chat();
		if (res == 1)
			return 3; // 401 You can't can't with a blocked user or or with a user who has blocked you
		if (res == 2)
			return 4; // 401 You don't have match with this perssonne you can't chat
		if (res == 3)
			return 5; // 500
		if (await create_tables() == 1)
			return 5;
		const res_add_chat = await add_chat()
		glob_res_add_chat = res_add_chat
		if (res_add_chat == 3)
			return 5;
		// console.log();
		// si pas co notif
		// si co message en direct
		await new_notif(UserId, id_profil, 4, io) // chats
		if (await get_online(id_profil) == true) {
			const socket_id = await get_socket_id(id_profil)
			if (socket_id) {
				const message_obj = {
					id: res_add_chat.insertId,
					author: UserId,
					message: message
				}
				io.to(socket_id).emit('message', message_obj);
			}
		}
		return 0;
	}

	const err = await add_chat_main();
	if (err == 0) {
		res.status(200).json({ id: glob_res_add_chat.insertId, author: UserId, message: message });
		// console.log('OK 200 : add chat sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : add chat fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : add chat fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log("Unauthorized 401 : You can't can't with a blocked user or or with a user who has blocked you ");
		res.status(401).json({ message: "You can't can't with a blocked user or or with a user who has blocked you" });
		return;
	}
	else if (err == 4) {
		// console.log("Unauthorized 401 : You don't have match with this perssonne you can't chat ");
		res.status(401).json({ message: "You don't have match with this perssonne you can't chat" });
		return;
	}
	else if (err == 5) {
		// console.log("Internal Server Error 500: sql request fail");
		res.status(500).json({ message: "Internal Server Error 500: sql request fail" });
		return;
	}
});

module.exports = router;
