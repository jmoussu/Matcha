const express = require('express');
const router = express.Router();
const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../src/jwt/jwt.js');
const validation = require("../../../src/validation");

router.use(express.json());

router.post('/', async (req, res) => {

	async function update_info(email, firstname, lastname, gender, age, UserId) {
		let sql = "UPDATE users SET email = ?, firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
		const inserts = [email, firstname, lastname, gender, age, UserId];
		// sql = db.format(sql, inserts);
		try {
			await db.query(sql, inserts);
			return;
		}
		catch (err) {
			// console.log('REQUEST UPDATE_INFO FAIL ');
			return 1;
		}
	}

	const email = req.body.email;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const gender = req.body.gender;
	const age = req.body.age;
	const UserId = await jwt.verifyUser(req.headers['authorization']);

	async function info() {
		if (UserId < 1)
			return 1;
		if (!!email != true || !!firstname != true || !!lastname != true || !(!!gender) || !(!!age))
			return 2;
		if ( ! await validation.emailValidation(email) || ! await validation.firstnameValidation(firstname) || ! await validation.lastnameValidation(lastname) || ! await validation.ageValidation(age) || ! await validation.genderValidation(gender))
			return 2;
		if (await update_info(email, firstname, lastname, gender, age, UserId) == 1)
			return 3;
		return 0;
	}


	// response
	let err = await info();
	if (err == 0) {
		res.status(200).json(req.body);
		// console.log('OK 200 : update info sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : update info fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : update info fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST update info FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST update info FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
