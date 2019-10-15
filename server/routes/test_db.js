const express = require('express');
const router = express.Router();
const mysql_login = require('../src/mysql_login.js');
const db = mysql_login.pool;

router.get('/', async (req, res) => {
	let sql = 'SHOW TABLES';
	try {
		const ret = await db.query(sql);
		const tables = ret.map( x => x = x.Tables_in_matcha);
		res.status(200).json({ message: 'Test de connection a la Database OK Tables = ' + tables });
		// console.log('Test de connection a la Database OK Tables = ' + tables );
	}
	catch (err) {
		res.status(500).json({ message: 'Internal Server Error 500: Test de connection a la Database FAIL REQUEST SHOW TABLES FAIL'});
		// console.error('Internal Server Error 500: Test de connection a la Database FAIL REQUEST SHOW TABLES FAIL');
	}
});

module.exports = router;
