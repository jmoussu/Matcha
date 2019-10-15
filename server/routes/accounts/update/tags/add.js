const express = require('express');
const router = express.Router();
const mysql_login = require('../../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../../src/jwt/jwt.js');
const validation = require("../../../../src/validation");
const get_user_tags = require("../../../../src/get_user_tags");

router.use(express.json());

router.post('/', async (req, res) => {
	async function create_tables() {
		let sql = "CREATE TABLE IF NOT EXISTS tag(id int AUTO_INCREMENT, tag VARCHAR(255), primary key (id))";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_tables (tag) FAIL');
			return 1;
		}
		let sql2 = "CREATE TABLE IF NOT EXISTS tagging(id int AUTO_INCREMENT, id_user int, id_tag int, primary key (id))";
		try {
			await db.query(sql2);
		}
		catch (err) {
			// console.log('REQUEST create_tables (tagging) FAIL');
			return 1;
		}
	}

	async function nb_tag_validation(UserId) {
		let sql = "SELECT COUNT(*) as count FROM tagging WHERE id_user = ?";
		const inserts = [UserId];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 5)
				return -2;
			return ;
		}
		catch (err) {
			// console.log('REQUEST nb_tag_validation FAIL');
			return -1;
		}
	}
	
	async function tag_exist(tag) {
		let sql = "SELECT COUNT(*) as count FROM tag WHERE tag = ?";
		const inserts = [tag];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 1)
				return 1;
			else if (res[0].count === 0)
				return 0;
			return -1;
		}
		catch (err) {
			// console.log('REQUEST tag_exist FAIL');
			return -1;
		}
	}

	async function tagging_exist(tagId, UserId) {
		let sql = "SELECT COUNT(*) as count FROM tagging WHERE id_tag = ? AND id_user = ?";
		const inserts = [tagId, UserId];
		try {
			const res = await db.query(sql, inserts);
			if (res[0].count >= 1)
				return 1;
			else if (res[0].count === 0)
				return 0;
			return -1;
		}
		catch (err) {
			// console.log('REQUEST tagging_exist FAIL');
			return -1;
		}
	}

	async function create_tag(tag) {
		let sql = "INSERT INTO tag (`tag`) VALUES(?)";
		try {
			const res = await db.query(sql, tag);
			return ;
		}
		catch (err) {
			// console.log('REQUEST create tag FAIL');
			return 1;
		}
	}

	async function get_tagId(tag) {
		let sql = "SELECT id FROM tag WHERE tag = ?";
		try {
			const res = await db.query(sql, tag);
			return res[0].id;
		}
		catch (err) {
			// console.log('REQUEST get tagId FAIL');
			return -1;
		}
	}

	async function add_tagging(tagId, UserId) {
		let sql = "INSERT INTO tagging (id_tag, id_user) VALUES (?, ?)";
		const inserts = [tagId, UserId];
		try {
			await db.query(sql, inserts);
			return ;
		}
		catch (err) {
			// console.log('REQUEST add_tagging FAIL ');
			return 1; 
		}
	}

	const UserId = await jwt.verifyUser(req.headers['authorization']);
	const tag = req.body.tag;

	async function add_tag() {
		if (UserId < 1)
			return 1;
		if (!(!!tag))
			return 2;
		if (! await validation.tagValidation(tag))
			return 2;
		if (await create_tables() === 1)
			return 3; // 500
		const nb_tag_user = await nb_tag_validation(UserId);
		if (nb_tag_user === -1) // request count user tag fail 500
			return 4;
		if (nb_tag_user === -2) // User can't have more tag 401
			return 5;
		const tag_exist_res = await tag_exist(tag);
		if (tag_exist_res === -1) 
			return 6; // 500 request tag exist fail
		if (tag_exist_res === 0) { // ya pas le tag
			if (await create_tag(tag) == 1)
				return 7; // 500 create tag 
		}
		else /* if (tag_exist_res === 1)*/ {
			const tag_id = await get_tagId(tag);
			if (tag_id === -1)
				return 8;
			const tagging_exist_res = await tagging_exist(tag_id, UserId);
			if (tagging_exist_res === -1) 
				return 9; // 500 request tagging exist fail
			if (tagging_exist_res === 1)
				return 10; // User allreay have this tag 401
		}
		const tag_id = await get_tagId(tag);
		if (tag_id === -1)
			return 8;
		if (await add_tagging(tag_id, UserId) == 1)
			return 11;
		return 0;
	}

	let err = await add_tag();
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
		res.status(400).json({ message: 'Bad request 400 : add tag fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : add tag fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST create tables tag / tagging FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST create tables tag / tagging FAIL' });
		return;
	}
	else if (err == 4) {
		// console.log('Internal Server Error 500: REQUEST count user tag FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST count user tag FAIL' });
		return;
	}
	else if (err == 5) {
		// console.log("Unauthorized 401 : You can't have more tag");
		res.status(401).json({ message: "You can't have more tag" });
		return;
	}
	else if (err == 6) {
		// console.log("Internal Server Error 500: request tag exist fail");
		res.status(500).json({ message: "Internal Server Error 500: request tag exist fail" });
		return;
	}
	else if (err == 7) {
		// console.log("Internal Server Error 500: request create tag fail");
		res.status(500).json({ message: "Internal Server Error 500: request create tag fail" });
		return;
	}
	else if (err == 8) {
		// console.log("Internal Server Error 500: request get_tagId fail");
		res.status(500).json({ message: "Internal Server Error 500: request get_tagId fail" });
		return;
	}
	else if (err == 9) {
		// console.log("Internal Server Error 500: request tagging exist fail");
		res.status(500).json({ message: "Internal Server Error 500: request tagging exist fail" });
		return;
	}
	else if (err == 10) {
		// console.log("Unauthorized 401 : You allready have this tag");
		res.status(401).json({ message: "You allready have this tag" });
		return;
	}
	else if (err == 11) {
		// console.log("Internal Server Error 500: request add tagging fail");
		res.status(500).json({ message: "Internal Server Error 500: request add tagging fail" });
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
		return;
	}
});


module.exports = router;
// renvoyer tout les tag du user 
