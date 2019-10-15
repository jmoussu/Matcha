const express = require('express');
const router = express.Router();

const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;

const send_mail = require("../../../src/send_mail");
jwt = require("../../../src/jwt/jwt_reset");
const validation = require("../../../src/validation")

router.use(express.json());

router.post('/', async (req, res) => {

	async function verif_email(email) {
		let sql = "SELECT id, password, email FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('REQUEST verif_mail FAIL');
			return 1;
		}
	}

	async function send_reset_email(email, userFound) {
		const token = await jwt.generateTokenForUser(userFound);
		const subject = "Bonjour vous avez perdu votre mot de passe sur Matcha ?!";
		const body = "<b> Bonjour vous avez perdu votre mot de passe sur Matcha ?! </b> <br>"
		+ "Vous pouvez changer le mot de passe de votre compte en cliquant sur <a href='http://localhost:3000/login/forget/reset/" + email + "/" + token + "'> ce lien </a>"
		if (send_mail(email, subject, body) == 1)
			return 1;
	}

	async function main() {
		email = req.body.email;
		if (!(!!email) )
			return 1; //Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.'
		if ( ! await validation.emailValidation(email))
			return 1; // Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.'
		const userFound = await verif_email(email);
		if (!(!!userFound))
			return 3;
		if (userFound === 1)
			return 2; // Internal Server Error 500: REQUEST verif_email FAIL'
		if (userFound.email != email) 
			return 3; //'Unauthorized 401 : email dont match in database'
		if (send_reset_email(email, userFound) == 1)
			return 4; // "Internal Server Error 500: email can't be send, account creation aborted"
		return 0;
	}

	let err = await main();
	if (err == 0) {
		res.status(200).json({ message: 'OK 200 : send reset password token sucsess' });
		// console.log('OK 200 : send reset password token sucsess');
		return;
	}
	else if (err == 1) {
		res.status(400).json({ message: 'Bad request 400 : send reset password token fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : send reset password token fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 2) {
		// console.log('Internal Server Error 500: REQUEST verif_email FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST verif_email FAIL' });
	}
	else if (err == 3) {
		res.status(401).json({ message: "email doesn't match in database" });
		// console.log("Unauthorized 401 : email doesn't match in database");
		return;
	}
	else if (err == 4) {
		// console.log("Internal Server Error 500: email reset password can't be send ");
		res.status(500).json({ message: "Internal Server Error 500: email reset password can't be send" });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
