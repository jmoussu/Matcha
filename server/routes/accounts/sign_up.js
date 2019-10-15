const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt_validation.js');
const send_mail = require("../../src/send_mail");
const passwordHash = require("password-hash");
const validation = require("../../src/validation")

router.use(express.json());

router.post('/', async (req, res) => {
	async function create_table() {
		let sql = "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), gender VARCHAR(255), age int, searchPreferences int DEFAULT '7', bio VARCHAR(255), score int DEFAULT '0', latitude FLOAT DEFAULT NULL, longitude FLOAT DEFAULT NULL, last_visit DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, valide int DEFAULT '0', PRIMARY KEY(id))";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_table (users) FAIL');
			return 1;
		}
	}

	async function verif_email(email) {
		let sql = "SELECT id, email FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('REQUEST verif_mail FAIL');
			return 1;
		}
	}

	async function add_user(email, password, firstname, lastname, gender, age) {
		const hash_password = await passwordHash.generate(password);
		let sql = "INSERT INTO users (`email`, `password`, `firstname`, `lastname`, `gender`, `age`) VALUES (?, ?, ?, ?, ?, ?)";
		const inserts = [email, hash_password, firstname, lastname, gender, age];
		// sql = db.format(sql, inserts);
		try {
			const res = await db.query(sql, inserts);
			return ;
		}
		catch (err) {
			// console.log('REQUEST ADD_USER FAIL ');
			return -1; 
		}
	}
	async function send_email(email, firstname, lastname, token) {
		const subject = "Bonjour " + firstname + " " + lastname + " Bienvenue sur matcha";
		const html= '<b>' + "Bonjour " + firstname + " " + lastname + " Bienvenue sur matcha" + "</b><br>" + "Merci de valider votre compte en cliquant sur <a href='http://localhost:3000/register/validate/" + email + "/" + token + "'> ce lien </a>";
		if (await send_mail(email, subject, html) == 1)
			return 1;
	}

	async function get_user(email) {
		const sql = "SELECT id FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('REQUEST get_user FAIL');
			return -1;
		}
	}

	async function sign_up(req) {
		if (await create_table() == 1)
			return 3;
		const email = req.body.email;
		const password = req.body.password;
		const firstname = req.body.firstname;
		const lastname = req.body.lastname;
		const gender = req.body.gender;
		const age = req.body.age;
		// verif basique a FINIR ICI
		if (!!email != true || !!password != true || !!firstname != true || !!lastname != true || !!gender != true || !!age != true) {
			return 1;
		}
		if (await validation.emailValidation(email) != true || await validation.passwordValidation(password) != true 
		|| await validation.firstnameValidation(firstname) != true || await validation.lastnameValidation(lastname) != true
		|| await validation.genderValidation(gender) != true || await validation.ageValidation(age) != true) {
		return 1;
		}
		let email_find = await verif_email(email);
		if (email_find == 1)
			return 3;
		if (email_find != null)
			return 2;
		if (await add_user(email, password, firstname, lastname, gender, age) == 1)
			return 3;
		const userFound = await get_user(email);
		if (userFound == -1)
			return 5;
		const token = await jwt.generateTokenForUser(userFound);
		if (await send_email(email, firstname, lastname, token) == 1)
			return 4;
		return 0;
	}


	// response
	let err = await sign_up(req);
	if (err == 0) {
		res.status(200).json({ message: 'OK 200 : sing_up sucsess' });
		// console.log('OK 200 : sing_up sucsess');
		return;
	}
	else if (err == 1) {
		res.status(400).json({ message: 'Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 2) {
		res.status(401).json({ message: 'E-mail already exists' });
		// console.log('Unauthorized 401 : sing_up fail email already exists in database');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST sing up FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST sing up FAIL' });
	}
	else if (err == 4) {
		// console.log("Internal Server Error 500: email can't be send, account creation aborted");
		res.status(500).json({ message: "Internal Server Error 500: email can't be send, account creation aborted" });
	}
	else if (err == 5) {
		// console.log('Internal Server Error 500: REQUEST get_user FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST get_user FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
