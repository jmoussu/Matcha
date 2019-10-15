const express = require('express');
const router = express.Router();
const mysql_login = require('../src/mysql_login.js');
const db = mysql_login.pool;
const fs = require('fs');
const passwordHash = require("password-hash");
const Avatar = require('avatar-builder');
const randtoken = require('rand-token');
const random_name = require('node-random-name');
const txtgen = require('txtgen');

router.use(express.json());

router.post('/', async (req, res) => {
	const nb_fake = req.body.nb_fake;
	const seed_password = req.body.seed_password

	async function the_while(res_create_tag_fake) {
		const dir = './uploads';
		if (!fs.existsSync(dir))
			fs.mkdirSync(dir);
		const password = "Admin123";
		for (var i = 0; i < nb_fake; i++) {
			const hash_password = passwordHash.generate(password);
			const age = Math.floor(Math.random() * (81 - 16)) + 16;
			const score = Math.floor(Math.random() * 101);
			const searchPreferences = Math.floor(Math.random() * 7) + 1;
			const bio = txtgen.sentence();
			let ll = [48.8534, 2.3488];
			const rand_localisation = Math.floor(Math.random() * 3);
			if (rand_localisation == 1)
				ll = [43.2962, 5.3699]
			if (rand_localisation == 2)
				ll = [45.7578, 4.83201]
			let gender = "male";
			let invisible_gender = "male";
			const rand_gender = Math.floor(Math.random() * 5);
			if (rand_gender == 2 || rand_gender == 3) {
				gender = "female";
				invisible_gender = gender;
			}
			if (rand_gender == 4) {
				gender = "other";
				const rand_invisible_gender = Math.floor(Math.random() * 2);
				if (rand_invisible_gender == 1)
					invisible_gender = "female"
			}
			const lastname = random_name({ last: true });
			const firstname = random_name({ first: true, gender: invisible_gender });
			const email = firstname + '.' + lastname + "@gmail.com";
			const sql = "INSERT INTO users (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, searchPreferences, score, bio, latitude, longitude, valide) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
			const inserts = [email, hash_password, firstname, lastname, gender, age, searchPreferences, score, bio, ll[0], ll[1]];
			let res;
			try {
				res = await db.query(sql, inserts);
			}
			catch (err) {
				// console.log('REQUEST SEED FAIL ');
				return -1;
			}
			// Avatar //// Avatar //// Avatar //// Avatar //// Avatar //
			const user_id = res.insertId;
			let avatar;
			if (invisible_gender == "male")
				avatar = Avatar.male8bitBuilder(128);
			else
				avatar = Avatar.female8bitBuilder(128);
			const rand = randtoken.generate(8);
			const path = 'uploads/' + rand + '.png'
			avatar.create(rand).then(buffer => { fs.writeFileSync(path, buffer) });
			const sql2 = "INSERT INTO `pics` (`id_user`, `path`, `avatar`) VALUES (?, ?, 1)";
			const inserts2 = [user_id, path];
			try {
				await db.query(sql2, inserts2);
			}
			catch (err) {
				// console.log('REQUEST SEED (avatar) FAIL');
				return -1;
			}
			// TAG //// TAG //// TAG //// TAG //// TAG //
			const rand_tag = Math.floor(Math.random() * 4); // 0 1 2 3
			if (rand_tag == 1 || rand_tag == 3) {
				if (add_tagging(user_id, res_create_tag_fake[0]) == -1)
					return -1;
			}
			if (rand_tag == 2 || rand_tag == 3) {
				if (add_tagging(user_id, res_create_tag_fake[1]) == -1)
					return -1;
			}
		}
	}

	async function add_tagging(user_id, id_tag) {
		const sql = "INSERT INTO `tagging` (id_user, id_tag) VALUES (?, ?)";
		const inserts = [user_id, id_tag];
		try {
			await db.query(sql, inserts);
		}
		catch (err) {
			// console.log('REQUEST SEED (tagging) FAIL');
			return -1;
		}
	}

	async function create_tag_fake() {
		let t1;
		let t2;

		const testsql = "SELECT id FROM tag WHERE tag = 'fake' "
		const test2sql = "SELECT id FROM tag WHERE tag = '42' "

		try {
			t1 = await db.query(testsql);
			t2 = await db.query(test2sql);
		}
		catch (err) {
			// console.log('REQUEST SEED (tag) FAIL');
			return -1;
		}

		if (t1.length > 0)
			t1 = t1[0].id;
		else
			t1 = null;
		if (t2.length > 0)
			t2 = t2[0].id;
		else
			t2 = null;

		if (!t1) {
			const sql = "INSERT INTO `tag` (tag) VALUES ('fake')";
			try {
				t1 = await db.query(sql);
				t1 = t1.insertId;
			}
			catch (err) {
				// console.log("REQUEST SEED (tag) FAIL ('Fake')");
				return -1;
			}
		}
		if (!t2) {
			const sql2 = "INSERT INTO `tag` (tag) VALUES ('42')";
			try {
				t2 = await db.query(sql2);
				t2 = t2.insertId;
			}
			catch (err) {
				// console.log("REQUEST SEED (tag) FAIL ('42')");
				return -1;
			}
		}
		return [t1, t2];
	}

	async function main_seed() {
		if (!nb_fake || !seed_password)
			return 1; // 400 need nb_fake and seed_password
		if (nb_fake < 1 || nb_fake > 700)
			return 2; // 400 Seed can générate 1 to 700 profile
		if (seed_password != "Admin123")
			return 3; // 401 bad password
		const res_create_tag_fake = await create_tag_fake();
		if (res_create_tag_fake == -1)
			return 4;
		const res_the_while = await the_while(res_create_tag_fake);
		if (res_the_while == -1)
			return 4;
		return 0;
	}


	const err = await main_seed();
	if (err == 0) {
		res.status(200).json({ message: " SEED END WITH SUCCESS " });
		// console.log('OK 200 : SEED END WITH SUCCESS');
		return;
	}
	else if (err == 1) {
		res.status(400).json({ message: 'Bad request 400 : seed need nb_fake and seed_password The request had bad syntax or was inherently impossible to be satisfied.' });
		// console.log('Bad request 400 : seed need nb_fake and seed_password fail The request had bad syntax or was inherently impossible to be satisfied.');
		return;
	}
	else if (err == 2) {
		res.status(401).json({ message: "Seed can générate only 1 to 700 profiles" });
		// console.log('Unauthorized 401 : Seed can générate only 1 to 700 profiles');
		return;
	}
	else if (err == 3) {
		res.status(401).json({ message: "Bad password" });
		// console.log('Unauthorized 401 : bad password');
		return;
	}
	else if (err == 4) {
		// console.log('Internal Server Error 500: REQUEST FAIL');
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST FAIL' });
		return 1;
	}
});

module.exports = router;
