const express = require('express');
const router = express.Router();
const mysql_login = require('../../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../../src/jwt/jwt.js');
const get_user_pics = require("../../../../src/get_user_pics");

router.use(express.json());

router.post('/', async (req, res) => {

	async function set_avatar(path) {
		const sql = "UPDATE pics SET avatar = 1 WHERE path = ?"
		try {
			await db.query(sql, path);
			return;
		}
		catch (err) {
			return -1;
		}
	}

	async function remove_avatar(UserId) {
		const sql = "UPDATE pics SET avatar = 0 WHERE id_user = ?";
		try {
			await db.query(sql, UserId);
			return;
		}
		catch (err) {
			return -1;
		}
	}

	async function verif_pic(path, UserId) {
		const sql = "SELECT COUNT(*) as count FROM pics WHERE path = ? AND id_user = ?";
		const inserts = [path, UserId]
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count <= 0)
				return -2;
			return;
		}
		catch (err) {
			return -1;
		}
	}

	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const path = req.body.path;

	async function set_avatar_main() {
		if (UserId < 1)
			return 1;
		if (!(!!path))
			return 2;
		const verif = await verif_pic(path, UserId);
		if (verif == -2)
			return 3; // 401 This picture not exist or does not belong to you
		if (verif == -1)
			return 4 // 500 request verif pic fail 
		if (await remove_avatar(UserId) == -1)
			return 5 // 500 
		if (await set_avatar(path) == -1)
			return 6 // 500
		return 0;
	}

	const err = await set_avatar_main();
	switch (err) {
		case 0:
			res.status(200).json({ pics: await get_user_pics(UserId) }); // return all user tag
			// console.log('OK 200 : set_avatar sucsess');
			break;
		case 1:
			res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
			// console.log('Unauthorized 401 : Bad token');
			break;
		case 2:
			res.status(400).json({ message: 'Bad request 400 : set avatar fail The request had bad syntax or was inherently impossible to be satisfied.' });
			// console.log('Bad request 400 : set avatar fail The request had bad syntax or was inherently impossible to be satisfied.');
			break;
		case 3:
			res.status(401).json({ message: 'This picture not exist or does not belong to you' });
			// console.log('Unauthorized 401 : This picture not exist or does not belong to you');
			break;
		case 4:
			// console.log('Internal Server Error 500: REQUEST verif pic FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST verif pic FAIL' });
			break;
		case 5:
			// console.log('Internal Server Error 500: REQUEST remove avatar FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST remove avatar FAIL' });
			break;
		case 6:
			// console.log('Internal Server Error 500: REQUEST set avatar FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST set avatar FAIL' });
			break;
		default:
			// console.log('Internal Server Error 500: unknow error');
			res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
})

module.exports = router;
