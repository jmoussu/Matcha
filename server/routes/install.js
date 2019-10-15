const express = require('express');
const router = express.Router();

const mysql_login = require('../src/mysql_login.js');
let db = mysql_login.pool;

const fs = require('fs');

router.use(express.json());


router.post('/', async (req, res) => { // ADD PROTECTION POST JSON ADMIN123
	if (req.body.install_password != "Admin123") {
		res.status(401).json({ message: "Unauthorized 401 : Can't install you need to use the instalation password" });
		// console.log("Unauthorized 401 : Can't install you need to use the instalation password");
		return;
	}
	function read() {
		try {
			let dbQueries = fs.readFileSync('./install_db_matcha.sql', 'utf8');
			return dbQueries;
		}
		catch (err) {
			// console.log("read install error");
			return 1;
		}
	}
	let dbQueries = await read();
	dbQueries = dbQueries.trim();
	if (dbQueries == 1) {
		// console.log('Internal Server Error 500: REQUEST INSTALL FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST INSTALL FAIL' });
	}
	dbQueries = dbQueries.split(';');
	dbQueries.forEach(async (x, index) => {
		try {
			if (x.length > 0)
				await db.query(x);
		}
		catch (err) {
			// console.log('Install query fail ?!');
			// console.log("|||||||||||||||||");
			// console.log(index);
			// console.log(x.length);
			// console.log(x);
			// console.log("^^^^^^^^^^^^^^^^");
		}
	});
	res.status(200).json({ message: 'Install Database SUCCESS' });
	// console.log('Install Database SUCCESS');
});

module.exports = router;
