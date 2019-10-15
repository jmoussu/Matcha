const express = require('express');
const router = express.Router();
const mysql_login = require('../../src/mysql_login.js');
const db = mysql_login.pool;
const passwordHash = require("password-hash");
const jwt = require('../../src/jwt/jwt.js');
const searchPreferences_conversion = require('../../src/searchPreferences_conversion')
const validation = require("../../src/validation")
const get_user_tags = require("../../src/get_user_tags");
const get_user_pics = require("../../src/get_user_pics");
const get_notif = require("../../src/notification/get_notif")
const geoip = require('geoip-lite');
const change_score = require('../../src/change_score');
const NodeGeocoder = require('node-geocoder');
const options = {
	provider: 'openstreetmap',

	// Optional depending on the providers
	httpAdapter: 'https', // Default
	// apiKey: 'AIzaSyDWQjiOu7-cdeCtUjSjDkmWr408aW-w9UM', // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

router.use(express.json());

router.post('/', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const latitude = req.body.latitude;
	const longitude = req.body.longitude;
	const userFound = await verif_email(email);
	const ip = req.connection.remoteAddress;
	const geo = geoip.lookup(ip);
	let city = "Unknown"

	async function verif_email(email) {
		let sql = "SELECT * FROM `users` WHERE email = ?";
		try {
			const res = await db.query(sql, email);
			return res[0];
		}
		catch (err) {
			// console.log('Internal Server Error 500: REQUEST verif_mail FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST verif_mail FAIL' });
			return 1;
		}
	}

	async function get_city() {
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

	async function add_loc(geo, req_latitude, req_longitude, userFound) {
		const sql = "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?";
		let inserts = null;
		if (req_latitude, req_longitude) {
			inserts = [req_latitude, req_longitude, userFound.id];
		}
		else if (geo) {
			inserts = [geo.ll[0], geo.ll[1], userFound.id];
		}
		else {
			// console.log("No localisation (localhost / Private network) Default Paris 48.8534, 2.3488");
			inserts = [48.8534, 2.3488, userFound.id];
		}
		try {
			await db.query(sql, inserts);
		} 
		catch (error) {
			// console.log("REQUEST ADD_LOC FAIL");
		}
	}

	async function sign_in(userFound) {
		if (!(!!email) || !(!!password) || email == '' || password == '')
			return 1;
		if (await validation.emailValidation(email) != true || await validation.passwordValidation(password) != true)
			return 1;
		if (userFound == 1)
			return 5; // aready return err 500
		if (!(!!userFound) || !(!!userFound.email) || !(!!userFound.id) || !(!!userFound.password) || !(!!userFound.age) || !(!!userFound.gender) || typeof userFound.valide === 'undefined')
			return 2;
		if (userFound.valide == 0)
			return 4;
		if (!passwordHash.verify(password, userFound.password))
			return 3;
		add_loc(geo, latitude, longitude, userFound);
		city = await get_city();
		change_score(-1, userFound.id);
		return 0;
	}
	let err = await sign_in(userFound);
	if (err == 0) {
		const tokenjwt = await jwt.generateTokenForUser(userFound);
		const userId = userFound.id
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
		// console.log('OK 200 : sing_in sucsess');
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
		res.status(400).json({ message: 'Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : sing_up fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 2) {
		res.status(401).json({ message: "E-mail dosen't exists" });
		// console.log('Unauthorized 401 : sing_in fail E-mail dosen\'t exists in database');
		return;
	}
	else if (err == 3) {
		res.status(401).json({ message: 'Wrong Password' });
		// console.log('Unauthorized 401 : sing_in fail Wrong Password when verify in database');
		return;
	}
	else if (err == 4) {
		res.status(401).json({ message: "Account hasn't been validated yet" });
		// console.log("Unauthorized 401 : Account hasn't been validated yet");
		return;
	}
});

module.exports = router;
