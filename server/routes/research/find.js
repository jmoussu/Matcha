const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt')
const get_user_tags = require('../../src/get_user_tags');
const get_online = require('../../src/socket/online');
const validation = require("../../src/validation");
const searchPreferences_conversion = require('../../src/searchPreferences_conversion');

// SELECT
//     users.id,
//     users.age,
//     users.firstname,
//     users.bio,
//     users.gender,
//     users.searchPreferences,
//     users.last_visit,
//     pics.path,
//     blocks.blocked AS blocked
// FROM
//     users
// LEFT JOIN pics ON pics.id_user = users.id AND pics.avatar = 1
// LEFT JOIN blocks ON blocks.user = ? AND blocks.blocked = users.id
// LEFT JOIN tagging ON tagging.id_user = users.id
// INNER JOIN tag on tag.id = tagging.id_tag AND tag.tag IN (?, ?)
// WHERE
// 	blocked IS NULL
// 	AND(
//         users.gender = ? OR users.gender = ?
// 	)
// 	AND(
//         users.searchPreferences = ? OR users.searchPreferences = ? OR users.searchPreferences = ? OR users.searchPreferences = ?
//     ) AND(
//         users.latitude <= ? AND users.latitude >= ? AND users.longitude <= ? AND users.longitude >= ?
//     ) AND(
//         users.age <= ? AND users.age >= ?
//     ) AND(
//         users.score <= ? AND users.score >= ?
//     )
// GROUP BY
//     id

// {
// 	searchPref: ['male', 'female', 'other'], // List
// 	sex: 'male', 
// 	popularity: [0, 100],
// 	age: [18, 80],
// 	tags: ['tag1', 'tag2'], // list
// 	location: 20, // km range
//   }

router.use(express.json());

router.post('/', async (req, res) => {
	const UserId = await jwt.verifyUser(req.headers['authorization']); // verif -1
	const searchPref = req.body.searchPref; // verif ?? typeof tab lenght 0-3
	const gender = req.body.sex;
	const popularity = req.body.popularity;
	const age = req.body.age;
	const tags = req.body.tags;
	const location = req.body.location;

	const localisation = await get_localisation();

	let result = [];

	async function get_localisation() {
		const sql = "SELECT latitude, longitude FROM users WHERE id = ?"
		try {
			const res = await db.query(sql, UserId);
			return [res[0].latitude, res[0].longitude];
		}
		catch (error) {
			// console.log("reshearch get localisation error");
			return -1;
		}
	}

	async function add_online(result) {
		return await Promise.all(result.map(async (x) => {
			try {
				x.online = get_online(x.id);
				return x;
			}
			catch (error) {
				// console.log("add_online reshearch error");
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

	async function add_distance(result) {
		return await Promise.all(result.map(async (x) => {
			try {
				const my_lat = localisation[0];
				const my_lon = localisation[1];
				const his_lat = x.latitude;
				const his_lon = x.longitude;
				x.distance = (Math.abs(my_lat - his_lat ) + Math.abs(my_lon - his_lon))
				return x;
			} catch (error) {
				return null;
			}
		}
		))
	}

	async function create_sql_inserts(wantMe, lll, agel, scorel) {
		let sql = "SELECT users.id, users.age, users.score, users.firstname, users.bio, users.gender, users.searchPreferences, users.latitude, users.longitude, users.last_visit, pics.path, blocks.blocked AS blocked FROM users LEFT JOIN pics ON pics.id_user = users.id AND pics.avatar = 1 LEFT JOIN blocks ON blocks.user = ? AND blocks.blocked = users.id";
		let inserts = [UserId];
		if (tags.length > 0 && tags.length < 51) {
			sql = sql + " LEFT JOIN tagging ON tagging.id_user = users.id INNER JOIN tag on tag.id = tagging.id_tag AND tag.tag IN ("
			for (let i = 0; i < tags.length; i++) {
				sql = sql + " ?";
				inserts.push(tags[i]);
				if (i != tags.length - 1)
					sql = sql + ','
			}
			sql = sql + " )"
		}
		sql = sql + " WHERE blocked IS NULL AND( users.gender IN ("
		for (let i = 0; i < searchPref.length; i++) {
			sql = sql + " ?";
			inserts.push(searchPref[i]);
			if (i != searchPref.length - 1)
				sql = sql + ','
		}
		sql = sql + " ) ) AND ( users.searchPreferences = ? OR users.searchPreferences = ? OR users.searchPreferences = ? OR users.searchPreferences = ? ) AND( users.latitude <= ? AND users.latitude >= ? AND users.longitude <= ? AND users.longitude >= ? ) AND( users.age >= ? AND users.age <= ? ) AND (users.score >= ? AND users.score <= ? ) AND (users.id != ?) GROUP BY id"
		inserts.push(wantMe[0], wantMe[1], wantMe[2], wantMe[3], lll[0], lll[1], lll[2], lll[3], agel[0], agel[1], scorel[0], scorel[1], UserId);
		return [sql, inserts];
	}

	async function research(sql, inserts) {
		try {
			return await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST research FAIL');
			return -1;
		}
	}

	async function main_research() {
		if (UserId < 1)
			return 1; // 401
		if (!searchPref || !gender || !popularity || !age || !tags || !location)
			return 2; // 400
		if (!Array.isArray(searchPref) || !validation.genderValidation(gender) || !Array.isArray(popularity) || !Array.isArray(age) || !Array.isArray(tags) || typeof location != "number")
			return 3; // 400
		if (searchPref.length <= 0)
			return 0;
		if (searchPref.length > 3 || popularity.length != 2 || age.length != 2)
			return 4 // 400
		if (localisation == -1)
			return 5; // 500
		let wantMe;
		if (gender == "other")
			wantMe = [1, 3, 5, 7];
		if (gender == "female")
			wantMe = [2, 3, 6, 7];
		if (gender == "male")
			wantMe = [4, 5, 6, 7];
		if (localisation[0] == null || localisation[1] == null)
			return 6 // 400 erreur localisation
		// 1 deg de lat = 111km 1 deg de long = 80km 
		// 1km y = 0,0090 / 1km x = 0.0125
		const lll = [0, 0, 0, 0];
		lll[0] = localisation[0] + location * 0.009;
		lll[1] = localisation[0] - location * 0.009;
		lll[2] = localisation[1] + location * 0.0125;
		lll[3] = localisation[1] - location * 0.0125;
		const res_create_sql_inserts = await create_sql_inserts(wantMe, lll, age, popularity);
		result = await research(res_create_sql_inserts[0], res_create_sql_inserts[1]);
		if (result == -1)
			return 5;
		result = await add_tags(result);
		result = await add_sp(result);
		result = await add_online(result);
		result = await add_distance(result);
		return 0;
	}

	const err = await main_research();
	if (err == 0) {
		res.status(200).json({ result: result });
		// console.log('OK 200 : research sucsess');
		return;
	}
	if (err == 6) {
		res.status(200).json({ result: result });
		// console.log('OK 200 : Research give nothing due to no localisation in the profile');
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2 || err == 3 || err == 4) {
		res.status(400).json({ message: 'Bad request 400 : research The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : research The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 5) {
		// console.log('Internal Server Error 500: REQUEST FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST FAIL' });
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
