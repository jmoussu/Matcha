const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt')
const get_user_tags = require('../../src/get_user_tags');
const get_online = require('../../src/socket/online');
const searchPreferences_conversion = require('../../src/searchPreferences_conversion')


router.post('/', async (req, res) => {
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	let result = [];

	async function get_users_like_you() {
		// Not exlude blocked ppl const sql = "SELECT users.id, users.age, users.firstname, users.bio, users.last_visit, pics.path FROM users INNER JOIN likes ON likes.user = users.id INNER JOIN pics on pics.id_user = users.id WHERE likes.liked = ? AND pics.avatar = 1 ORDER BY likes.time DESC";
		const sql = "SELECT users.id, users.age, users.firstname, users.gender, users.searchPreferences, users.bio, users.last_visit, pics.path, blocks.blocked as blocked FROM users INNER JOIN likes ON likes.user = users.id INNER JOIN pics ON pics.id_user = users.id LEFT JOIN blocks ON blocks.user = ? AND blocks.blocked = users.id WHERE likes.liked = ? AND pics.avatar = 1 AND blocked IS NULL GROUP BY id ORDER BY likes.time DESC";
		try {
			return await db.query(sql, [UserId, UserId]);
		}
		catch (err) {
			// console.log('REQUEST get_users_like_you FAIL');
			return 1;
		}
	}

	async function add_tags(result) {
		return await Promise.all(result.map(async (x) => {
			try {
				x.tags = await get_user_tags(x.id)
				if (x.tags == -1)
					return 1;
				return x;
			} catch (error) {
				return 1;
			}
		}
		))
	}
	
	async function add_sp(result) {
		return await Promise.all(result.map(async (x) => {
			try {
				x.searchPreferences = await searchPreferences_conversion(x.searchPreferences);
				return x;
			} catch (error) {
				return 1;
			}
		}
		))
	}

	async function add_online(result) {
		return await Promise.all(result.map(async (x) => {
			try {
				x.online = await get_online(x.id)
				return x;
			} 
			catch (error) {
				// console.log("add online history likes error");
				return 1;
			}
		}
		))
	}

	async function get_users_like_you_main() {
		if (UserId < 1)
			return 1; // 401 bad token
		result = await get_users_like_you();
		result = await add_tags(result);
		result = await add_sp(result);
		result = await add_online(result);
		if (result == 1)
			return 2;
		return 0;
	}

	let err = await get_users_like_you_main();
	if (err == 0) {
		res.status(200).json({ result: result });
		// console.log('OK 200 : Get history users like you sucsess');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		// console.log("Internal Server Error 500: sql request Get history users like you fail");
		res.status(500).json({ message: "Internal Server Error 500: sql request Get history users like you fail" });
		return;
	}
});

module.exports = router;
