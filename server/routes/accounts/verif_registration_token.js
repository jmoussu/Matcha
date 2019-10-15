const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt_validation.js');

router.use(express.json());

router.post('/', async (req, res) => {
	async function get_valide(email) {
		const sql = "SELECT valide, id FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('REQUEST get_token FAIL');
			return -1;
		}
	}

	async function validate_account(email){
		const sql = "UPDATE users SET valide = '1' WHERE email = ?";
		try {
			await db.query(sql, email);
		}
		catch (err) {
			// console.error('REQUEST VALIDATE_ACCOUNT FAIL');
			return 1
		}
	}

	async function verif_registration_token() {
		const email = req.body.email;
		const token = req.headers['authorization'];
		const userFound = await get_valide(email);
		if (!!email != true || !!token != true)
			return 1; // 400 bad request
		if (userFound == -1)
			return 4 // 500 err
		if (!(!!userFound) || typeof userFound.valide === 'undefined')
		{
			return 2 // 401 email or token doesn't exists in database
		}
		const valide = userFound.valide;
		const id = userFound.id;
		if (valide != 0)
			return 5;
		const jwt_userId = await jwt.verifyUser(token)
		if (await jwt_userId == -1 || jwt_userId != id) 
			return 3; // 401 bad token
		if (await validate_account(email) == 1) 
			return 4; // 500
		return 0;
	}

	const err = await verif_registration_token();
	if (err == 0) {
		res.status(200).json({ message: 'OK 200 : Validation sucsess' });
		// console.log('OK 200 : Validation sucsess');
		return;
	}
	else if (err == 1) {
		res.status(400).json({ message: 'Bad request 400 : validation fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : validation fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 2) {
		res.status(401).json({ message: "email or other doesn't exists in database" });
		// console.log("Unauthorized 401 : email token or valide doesn't exists in database");
		return;
	}
	else if (err == 3) {
		res.status(401).json({ message: "bad token" });
		// console.log("Unauthorized 401 : bad token");
		return;
	}
	else if (err == 5) {
		res.status(401).json({ message: "Account already validated" });
		// console.log("Unauthorized 401 : Account already validated");
		return;
	}
	else if (err == 4) {
		// console.log('Internal Server Error 500: REQUEST validate_account or get_token FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST validate_account or get_token FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
