const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;

router.get('/', async (req, res) =>{

	async function select_tag() {
		let sql = "SELECT DISTINCT tag FROM `tag`";
		try {
			const res = await db.query(sql);
			return res.map((data) => data.tag);
		}
		catch (err) {
			return -1;
		}
	}

	const tags = await select_tag();

	async function get_tag() {
		if (tags === -1)
			return 1;
		return 0;
	}

	let err = await get_tag();
	if (err == 0) {
		res.status(200).json({ tags: tags });
		// console.log('OK 200 : get_tags sucsess');
		return;
	}
	else if (err == 1) {
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST get_tag FAIL' });
		// console.log('Internal Server Error 500: REQUEST get_tag FAIL');
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
