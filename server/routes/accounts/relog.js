const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../src/jwt/jwt.js');
const searchPreferences_conversion = require('../../src/searchPreferences_conversion')
const get_user_tags = require("../../src/get_user_tags");
const get_user_pics = require("../../src/get_user_pics");
const get_notif = require("../../src/notification/get_notif")
const NodeGeocoder = require('node-geocoder');
const options = {
	provider: 'openstreetmap',

	// Optional depending on the providers
	httpAdapter: 'https', // Default
	// apiKey: 'AIzaSyDWQjiOu7-cdeCtUjSjDkmWr408aW-w9UM', // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

// router.use(express.json()); // pas de json only req.header en post

router.post('/', async (req, res) => {
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	let userFound;
	let city;

	async function get_city(userFound) {
		if (userFound.latitude && userFound.longitude) {
			const res_geo = geocoder.reverse({ lat: userFound.latitude, lon: userFound.longitude })
				.then(function (resu) {
					if (resu[0].city == null)
						return "Unknown";
					return resu[0].city;
				})
				.catch(function (err) {
					// console.log(err);
					return "Unknown";
				});
			if (res_geo == null)
				return "Unknown";
			return res_geo;
		}
		return "Unknown";
	}

	async function get_user(UserId) {
		let sql = "SELECT * FROM `users` WHERE id = ?";
		try {
			const res = await db.query(sql, UserId);
			return res[0];
		}
		catch (err) {
			// console.log('Internal Server Error 500: REQUEST get_user FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST get_user FAIL' });
			return 1;
		}
	}

	async function relog() {
		if (UserId < 1)
			return 1;
		userFound = await get_user(UserId);
		if (userFound == 1)
			return 5; // aready return err 500
		if (!(!!userFound) || !(!!userFound.email) || !(!!userFound.id) || !(!!userFound.password) || !(!!userFound.age) || !(!!userFound.gender) || typeof userFound.valide === 'undefined')
			return 2;
		if (userFound.valide == 0)
			return 4;
		city = await get_city(userFound);
		return 0;
	}
	
	let err = await relog();
	if (err == 0) {
		const tokenjwt = await jwt.generateTokenForUser(userFound);
		const userId = userFound.id;
		const notifications = await get_notif(userId);
		const account = {
			email: userFound.email,
			firstname: userFound.firstname,
			lastname: userFound.lastname,
			age: userFound.age,
			gender: userFound.gender,
			city: city
		};
		const preferences = await searchPreferences_conversion(userFound.searchPreferences);
		const profile = {
			bio: userFound.bio,
			score: userFound.score,
			tags: await get_user_tags(userFound.id),
			pics: await get_user_pics(userFound.id)
		}
		// console.log('OK 200 : relog sucsess');
		res.status(200).json({ 
			token: tokenjwt,
			userId: userId,
			notifications: notifications,
			account: account,
			searchPreferences: preferences,
			profile: profile
		});
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: "Your connection has expired thank you to reconnect" });
		// console.log('Bad request 400 : Your connection has expired thank you to reconnect');
		return;
	}
	else if (err == 2) {
		res.status(401).json({ message: "User dosen't exists or not corectly completed" });
		// console.log("Unauthorized 401 : User dosen't exists or not corectly completed");
		return;
	}
	else if (err == 4) {
		res.status(401).json({ message: "Account hasn't been validated yet" });
		// console.log("Unauthorized 401 : Account hasn't been validated yet");
		return;
	}
});

module.exports = router;
