// GOOGLE MAP API KEY : AIzaSyDWQjiOu7-cdeCtUjSjDkmWr408aW-w9UM
const express = require('express');
const router = express.Router();
const get_liked = require("../../src/like/get_liked");
const get_hasLiked = require("../../src/like/get_hasLiked");
const get_user_pics = require("../../src/get_user_pics");
const get_user_tags = require("../../src/get_user_tags");
const get_online = require("../../src/socket/online");
const get_user = require("../../src/get_user")
const jwt = require('../../src/jwt/jwt');
const searchPreferences_conversion = require('../../src/searchPreferences_conversion');
const NodeGeocoder = require('node-geocoder');
const options = {
	provider: 'openstreetmap',

	// Optional depending on the providers
	httpAdapter: 'https', // Default
	// apiKey: 'AIzaSyDWQjiOu7-cdeCtUjSjDkmWr408aW-w9UM', // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

router.get('/:id_user', async (req, res) => {
	const UserId = await jwt.verifyUser(req.headers['authorization']);

	const id_user = req.params.id_user;

	const pics = await get_user_pics(id_user);
	const tags = await get_user_tags(id_user);
	const userFound = await get_user(id_user);
	const liked = await get_liked(UserId, id_user);
	const hasLiked = await get_hasLiked(UserId, id_user);
	const city = await get_city();

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

	async function get_user_main() {
		if (UserId < 1)
			return 1;
		if (typeof userFound === 'undefined' || typeof pics === 'undefined' || typeof tags === 'undefined' || typeof liked === 'undefined' || typeof hasLiked === 'undefined')
			return 2
		if (pics == -1 || tags == -1 || userFound == -1 || liked == -1 || hasLiked == -1)
			return 3; //500 can't get user information
		return 0;
	}

	const err = await get_user_main()
	if (err == 0) {
		const account = {
			id: userFound.id,
			email: userFound.email,
			firstname: userFound.firstname,
			lastname: userFound.lastname,
			age: userFound.age,
			gender: userFound.gender,
			last_visit: userFound.last_visit,
			latitude: userFound.latitude,
			longitude: userFound.longitude,
			city: city
		};
		const preferences = await searchPreferences_conversion(userFound.searchPreferences);
		const profile = {
			bio: userFound.bio,
			score: userFound.score,
			tags: tags,
			pics: pics
		}
		res.status(200).json({

			account: account,
			searchPreferences: preferences,
			profile: profile,
			online: get_online(id_user),
			hasLiked: hasLiked, // es qu'elle me like
			liked: liked // es que moi j'ai like
		});
		return;
	}
	else if (err == 1) {
		res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
		// console.log('Unauthorized 401 : Bad token');
		return;
	}
	else if (err == 2) {
		res.status(404).json({ message: 'Not Found 404 : user not found' });
		// console.log('Not Found 404 : user not found');
		return;
	}
	else if (err == 3) {
		// console.log('Internal Server Error 500: REQUEST sql FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST sql FAIL' });
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
