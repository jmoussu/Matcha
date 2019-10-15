const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql_login = require('../../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../../src/jwt/jwt.js');
const get_user_pics = require("../../../../src/get_user_pics");

router.use(express.json());

router.post('/', async (req, res) => {

	async function remove_pic(path) {
		const sql = "DELETE FROM pics WHERE path = ?";
		try {
			await db.query(sql, path);
		}
		catch (err) {
			return -1;
		}
		try {
			await fs.unlinkSync(path);
		} catch (error) {}
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

	async function remove_pic_main() {
		if (UserId < 1)
			return 1;
		if (!(!!path))
			return 11;
		const verif = await verif_pic(path, UserId)
		if (verif == -2)
			return 2; // 401 This picture not exist or does not belong to you
		if (verif == -1)
			return 3 // 500 request verif pic fail 
		if (await remove_pic(path) == -1)
			return 4 // 500 request remove_pic fail
		return 0;
	}

	const err = await remove_pic_main();
	switch (err) {
		case 0:
			res.status(200).json({ pics: await get_user_pics(UserId) }); // return all user tag
			// console.log('OK 200 : remove pic sucsess');
			break;
		case 1:
			res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
			// console.log('Unauthorized 401 : Bad token');
			break;
		case 11:
			res.status(400).json({ message: 'Bad request 400 : remove pic fail The request had bad syntax or was inherently impossible to be satisfied.' });
			// console.log('Bad request 400 : remove pic fail The request had bad syntax or was inherently impossible to be satisfied.');
			break;
		case 2:
			res.status(401).json({ message: "This picture not exist or does not belong to you" });
			// console.log("Unauthorized 401 :  This picture not exist or does not belong to you");
			break;
		case 3:
			// console.log('Internal Server Error 500: request verif pic fail ');
			res.status(500).json({ message: 'Internal Server Error 500: request verif pic fail ' });
			break;
		case 4:
			// console.log('Internal Server Error 500: request remove_pic fail');
			res.status(500).json({ message: 'Internal Server Error 500: request remove_pic fail' });
			break;
		default:
			// console.log('Internal Server Error 500: unknow error');
			res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
