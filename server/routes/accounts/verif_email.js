const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login.js')
const db = mysql_login.pool;


router.use(express.json());

router.post('/', async (req, res) => {
	async function verif_email_indb(email) {
		let sql = "SELECT email FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('Internal Server Error 500: REQUEST verif_mail_indb FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST verif_mail_indb FAIL' });
			return 1;
		}
	}

	async function verif_email(req) {
		const email = req.body.email;
		if (!(!!email) || email == '') {
			return 1;
		}
		const userFound = await verif_email_indb(email);
		if (!(!!userFound ) || !(!!userFound.email)) {
			if (userFound == 1) {
				return 3;
			}
			return 2;
		}
		else {
			return 0;
		}
	}

	let err = await verif_email(req);
	if (err == 0) {
		res.status(200).json({ message: 'E-mail exists'});
		// console.log('OK 200 : E-mail exists in database');
		return;
	}
	if (err == 1) {
		res.status(400).json({ message: 'Bad request 400 : verif_mail fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : verif_mail fail The request had bad syntax or was inherently impossible to be satisfied.');
	}
	else if (err == 2) {
		res.status(401).json({ message: "E-mail doesn't exists" });
		// console.log('Unauthorized 401 : E-mail doesn\'t exists in database');
		return;
	}
});

module.exports = router;
