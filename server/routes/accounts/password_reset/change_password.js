const express = require('express');
const router = express.Router();
const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;
const passwordHash = require("password-hash");
const jwt = require("../../../src/jwt/jwt_reset");
const validation = require("../../../src/validation")

router.use(express.json());

router.post('/', async (req, res) => {

	async function verif_email(email) {
		let sql = "SELECT id, email, password FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('REQUEST verif_mail FAIL');
			return 1;
		}
	}

	async function update_password(UserId, newPassword) {
		const hash_password = await passwordHash.generate(newPassword);
		const sql = "UPDATE users SET password = ? WHERE id = ?";
		const inserts = [hash_password, UserId];
		try {
			await db.query(sql, inserts);
			return ;
		}
		catch (err) {
			// console.log('REQUEST UPDATE PASSWORD FAIL');
			return 1;
		}
	}

	async function main() {
		const email = req.body.email;
		const newPassword = req.body.password;
		if (!(!!email) || !(!!req.headers['authorization']) || !(!!newPassword))
			return 1; //Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.'
		if ( ! await validation.emailValidation(email) || ! await validation.passwordValidation(newPassword))
			return 1; // Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.'
		const userFound = await verif_email(email);
		if (!(!!userFound))
			return 3; // "Unauthorized 401 : email and/or token doesn't match in database"
		if (userFound === 1)
			return 2; // Internal Server Error 500: REQUEST verif_email FAIL'
		const UserId = await jwt.verifyUser(req.headers['authorization'], userFound.password);
		if (userFound.email != email || userFound.id != UserId) 
			return 3; // "Unauthorized 401 : email and/or token doesn't match in database"
		if (await update_password(UserId, newPassword) == 1)
			return 4; // Internal Server Error 500: REQUEST update password FAIL
		return 0;
	}

	let err = await main();
	if (err == 0) {
		res.status(200).json({ message: 'OK 200 : reset password sucsess' });
		// console.log('OK 200 : reset password sucsess');
		return;
	}
	else if (err == 1) {
		res.status(400).json({ message: 'Bad request 400 : reset password fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : reset password fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 2) {
		// console.log('Internal Server Error 500: REQUEST verif_email FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST verif_email FAIL' });
	}
	else if (err == 3) {
		res.status(401).json({ message: " email and/or token doesn't match in database" });
		// console.log("Unauthorized 401 :  email and/or token doesn't match in database");
		return;
	}
	else if (err == 4) {
		// console.log("Internal Server Error 500: update password FAIL");
		res.status(500).json({ message: "Internal Server Error 500:  update password FAIL" });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
