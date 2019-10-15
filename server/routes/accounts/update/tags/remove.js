const express = require('express');
const router = express.Router();
const mysql_login = require('../../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../../src/jwt/jwt.js')
const validation = require("../../../../src/validation");
const get_user_tags = require("../../../../src/get_user_tags");

router.use(express.json());

router.post('/', async (req, res) => {

	async function get_tag(tag) {
		const sql = "SELECT id FROM tag WHERE tag = ?";
		try {
			const res = await db.query(sql, tag);
			if (res.length <= 0)
				return 0;
			return res[0].id;
		}
		catch (err) {
			// console.log('REQUEST get_tag FAIL');
			return -1;
		}
	}

	async function remove_tagging(id_tag, UserId) { 
		const sql = "DELETE FROM tagging WHERE `id_tag` = ? AND id_user = ?";
		const inserts = [id_tag, UserId]; 
		try {
			await db.query(sql, inserts);
			return 0;
		}
		catch (err) {
			// console.log('REQUEST remove_tagging FAIL');
			return -1;
		}
	}

	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const tag = req.body.tag;

	async function main_remove() {
		if (UserId < 1)
			return 1;
		if (!(!!tag))
			return 2;
		if (! await validation.tagValidation(tag))
			return 2;
		const id_tag = await get_tag(tag);
		if (id_tag == -1)
			return 3; // 500 get tag
		if (id_tag == 0)
			return 4; // tag dosn't exist 401
		if (await remove_tagging(id_tag, UserId) == -1)
			return 5; // 500 remove tagging
		return 0;
	}

	const err = await main_remove();
	if (err == 0) {
		res.status(200).json({ tags: await get_user_tags(UserId) }); // return all user tag
		// console.log('OK 200 : add tag sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : remove tag fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : remove tag fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST get tag FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST get tag FAIL' });
	}
	else if (err == 4) {
		res.status(401).json({ message: "Unauthorized 401 : tag dosn't exist" });
		// console.log("Unauthorized 401 :  tag dosn't exist");
		return;
	}
	else if (err == 5) {
		// console.log('Internal Server Error 500: REQUEST remove tagging FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST remove tagging FAIL' });
	}
});

module.exports = router;



// {"tag": "tag"}
// get id (check) if "tag" exist in table tag
//verif
// token
// suprimer dans la table tagging la ligne where id user et id tag exist
