const express = require('express');
const router = express.Router();
const mysql_login = require('../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../src/jwt/jwt.js');

router.use(express.json());

router.post('/', async (req, res) => {
	const latitude = req.body.latitude;
	const longitude = req.body.longitude;
	const UserId = await jwt.verifyUser(req.headers['authorization']);

	async function change_loc() {
		const sql = "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?";
		const inserts = [latitude, longitude, UserId];
		try {
			await db.query(sql, inserts);
		}
		catch (error) {
			// console.log("REQUEST CHANGE_LOC FAIL");
			return -1;
		}
	}

	async function main_change_loc() {
		if (UserId < 1)
			return 1; // 401 bad token
		if (!!longitude != true || !!latitude != true)
			return 2; // 400 bad syntax
		if (longitude > 180 || latitude > 180 || longitude < -180 || latitude < -180)
			return 3; // 401 latitude and longitude [-180 to 180]
		if (await change_loc() == -1)
			return 4; // 500
		return 0;
	}

	const err = await main_change_loc();
	if (err == 0) {
		res.status(200).json({ message: "OK 200 : update localisation sucsess" });
		// console.log('OK 200 : update localisation sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(400).json({ message: 'Bad request 400 : update localisation fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : update info localisation The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 3) {
		res.status(401).json({ message: 'Unauthorized 401 :  latitude and longitude [-180 to 180]' });
		// console.log('Unauthorized 401 :  latitude and longitude [-180 to 180]');
		return;
	}
	else if (err == 4) {
		// console.log('Internal Server Error 500: REQUEST update localisation FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST update localisation FAIL' });
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
