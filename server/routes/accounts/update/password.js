const express = require('express');
const router = express.Router();
const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../src/jwt/jwt.js');
const validation = require("../../../src/validation");
const passwordHash = require("password-hash");

router.use(express.json());

router.post('/', async (req, res) => {

	async function update_password(password, UserId) {
		const hashed_password = await passwordHash.generate(password);
		let sql = "UPDATE users SET password = ? WHERE id = ?";
		const inserts = [hashed_password, UserId];
		try {
			await db.query(sql, inserts);
			return;
		}
		catch (err) {
			// console.log('REQUEST UPDATE_PASSWORD FAIL ');
			return 1;
		}
	}

	async function get_password(id) {
		let sql = "SELECT password FROM `users` WHERE id = ?";
		try {
			const res = await db.query(sql, id);
			if (typeof res[0] === 'undefined')
				return 1;
			return res[0];
		}
		catch (err) {
			// console.log('REQUEST GET_PASSWORD FAIL ');
			return 1;
		}
	}

	const password = req.body.password;
	const oldPassword = req.body.oldPassword;
	const UserId = await jwt.verifyUser(req.headers['authorization']);

	async function password_main() {
		if (UserId < 1)
			return 1;
		if (!!password != true || !!oldPassword != true)
			return 2;
		if ( ! await validation.passwordValidation(password) )
			return 2;
		const userFound = await get_password(UserId);
		if (userFound == 1)
			return 3;
		if (!passwordHash.verify(oldPassword, userFound.password))
			return 4;
		if (await update_password(password, UserId) == 1)
			return 5;
		return 0;
	}


	// response
	let err = await password_main();
	if (err == 0) {
		res.status(200).json({ message: 'OK 200 : update password sucsess' });
		// console.log('OK 200 : update password sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : update password fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : update password fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST get password FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST get password FAIL' });
	}
	else if (err == 4) {
		// console.log('Unauthorized 401 : Bad password');
		res.status(401).json({ message: 'Unauthorized 401 : Bad password' });
	}
	else if (err == 5) {
		// console.log('Internal Server Error 500: REQUEST update password FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST update password FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
