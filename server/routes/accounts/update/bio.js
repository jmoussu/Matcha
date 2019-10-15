const express = require('express');
const router = express.Router();
const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../src/jwt/jwt.js');
const validation = require("../../../src/validation")

router.use(express.json());

router.post('/', async (req, res) => {

	async function update_bio(bio, UserId) {
		let sql = "UPDATE users SET bio = ? WHERE id = ?";
		const inserts = [bio, UserId];
		// sql = db.format(sql, inserts);
		try {
			await db.query(sql, inserts);
			return;
		}
		catch (err) {
			// console.log('REQUEST UPDATE_BIO FAIL ');
			return 1;
		}
	}

	const bio = req.body.bio;
	const UserId = await jwt.verifyUser(req.headers['authorization']);

	async function bio_main() {
		if (UserId < 1)
			return 1;
		if (!!bio != true)
			return 2;
		if (! await validation.bioValidation(bio))
			return 2;
		if (await update_bio(bio, UserId) == 1)
			return 3;
		return 0;
	}


	// response
	let err = await bio_main();
	if (err == 0) {
		res.status(200).json(req.body);
		// console.log('OK 200 : update bio sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : update bio fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : update info bio The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST update bio FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST update bio FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
