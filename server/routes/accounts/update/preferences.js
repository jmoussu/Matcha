const express = require('express');
const router = express.Router();
const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../src/jwt/jwt.js');
const validation = require("../../../src/validation")
const searchPreferences_conversion = require('../../../src/searchPreferences_conversion');

router.use(express.json());

router.post('/', async (req, res) => {

	async function update_searchPreferences(obj_pref, UserId) {
		const int_pref = await searchPreferences_conversion(obj_pref);
		let sql = "UPDATE users SET searchPreferences = ? WHERE id = ?";
		const inserts = [int_pref, UserId];
		try {
			await db.query(sql, inserts);
			return;
		}
		catch (err) {
			// console.log('REQUEST update_searchPreferences FAIL ');
			return 1;
		}
	}

	const pref = req.body;
	const UserId = await jwt.verifyUser(req.headers['authorization']);

	async function preferences_main() {
		if (UserId < 1)
			return 1;
		if (typeof pref.male === "undefined" || typeof pref.female === "undefined" || typeof pref.other === "undefined")
			return 2;
		if ( ! await validation.prefValidation(pref) )
			return 2;
		if (await update_searchPreferences(pref, UserId) == 1)
			return 3;
		return 0;
	}


	// response
	let err = await preferences_main();
	if (err == 0) {
		res.status(200).json(pref);
		// console.log('OK 200 : update searchPreferences sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : update searchPreferences fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : update searchPreferences fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST update searchPreferences FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST update searchPreferences FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
