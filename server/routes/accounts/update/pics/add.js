const express = require('express');
const router = express.Router();
const util = require("util");
const randtoken = require('rand-token');
const multer = require('multer');
const fs = require('fs');
const mysql_login = require('../../../../src/mysql_login.js');
const db = mysql_login.pool;
const jwt = require('../../../../src/jwt/jwt.js');
const get_user_pics = require("../../../../src/get_user_pics");

const dir = './uploads';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		const date = Date.now();
		const rand = randtoken.generate(8);
		let name = 'null';
		if (file.mimetype === 'image/png')
			name = date + rand + '.png';
		if (file.mimetype === 'image/jpeg')
			name = date + rand + '.jpeg';
		cb(null, name);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
		middle_err = 2;
		cb(null, false);
		return;
	}
	cb(null, true);
}

const upload = util.promisify(multer({
	storage: storage,
	limits: {
		fileSize: 10485760 * 5// 50 Mb
	},
	fileFilter: fileFilter
}).single('img'));


let middle_err = 0;
let glob_userId;
let first_pic = 0;

router.use('/', async function (req, res, next) {
	const nb_pics_validation = async () => {
		let sql = "SELECT COUNT(*) as count FROM pics WHERE id_user = ?";
		try {
			const res = await db.query(sql, glob_userId);
			if (res[0].count >= 5)
				return -2;
			if (res[0].count == 0)
				first_pic = 1;
			else
				first_pic = 0;
			return;
		}
		catch (err) {
			// console.log('REQUEST nb_pics_validation FAIL');
			return -1;
		}
	}

	async function create_table() {
		const sql = "CREATE TABLE IF NOT EXISTS pics( id INT AUTO_INCREMENT, id_user INT, path VARCHAR(255), avatar BOOLEAN default false, PRIMARY KEY(id) )";
		try {
			await db.query(sql);
		}
		catch (err) {
			// console.log('REQUEST create_table (pics) FAIL');
			return 1;
		}
	}

	middle_err = 0;
	const UserId = await jwt.verifyUser(req.headers['authorization']);
	if (UserId < 1) {
		middle_err = 1;
	}
	glob_userId = UserId;
	if (await create_table() == 1)
		middle_err == 6;
	const err_nb_pics = await nb_pics_validation();
	if (err_nb_pics == -2) // 401 too mutch pictures remove one before add another picture
		middle_err = 4;
	if (err_nb_pics == -1) // 500 nb_pics_validation fail
		middle_err = 5
	next();
});


router.post('/', async (req, res) => {
	try {
		if (middle_err === 0)
			await upload(req, res);
	}
	catch (err) {
		middle_err = 3;
	}

	async function add_path() {
		if (first_pic == 0) {
			let sql = "INSERT INTO `pics` (`id_user`, `path`) VALUES (?, ?)";
			const inserts = [glob_userId, req.file.path];
			try {
				await db.query(sql, inserts);
			}
			catch (err) {
				// console.log('REQUEST add_path FAIL');
				return 1;
			}
		}
		else {
			let sql = "INSERT INTO `pics` (`id_user`, `path`, `avatar`) VALUES (?, ?, ?)";
			const inserts = [glob_userId, req.file.path, first_pic];
			try {
				await db.query(sql, inserts);
			}
			catch (err) {
				// console.log('REQUEST add_path FAIL');
				return 1;
			}
		}
	}

	async function add_pic() {
		if (middle_err == 1)
			return 1;
		if (middle_err == 2)
			return 2;
		if (middle_err == 3)
			return 3;
		if (middle_err == 4) // 401 too mutch pictures remove one before add another picture
			return 6;
		if (middle_err == 5) // 500 nb_pics_validation fail
			return 7;
		if (!!(!req.file))
			return 4;
		if (middle_err == 6)
			return 5;
		if (await add_path() == 1)
			return 8;
		return 0;
	}

	const err = await add_pic();
	switch (err) {
		case 0:
			res.status(200).json({ pics: await get_user_pics(glob_userId) }); // return all user tag
			// console.log('OK 200 : add pic sucsess');
			break;
		case 1:
			res.status(401).json({ message: 'Unauthorized 401 : Bad token' });
			// console.log('Unauthorized 401 : Bad token');
			break;
		case 2:
			res.status(401).json({ message: 'Unauthorized format use png or jpeg' });
			// console.log('Unauthorized 401 : Unauthorized format use png or jpeg');
			break;
		case 3:
			res.status(401).json({ message: 'Unauthorized to upload your file can be too big or upload key is bad' });
			// console.log('Unauthorized 401 : Unauthorized to upload your file can be too big or upload key is bad');
			break;
		case 4:
			res.status(401).json({ message: 'Unauthorized none file found' });
			// console.log('Unauthorized 401 : none file found');
			break;
		case 5:
			// console.log('Internal Server Error 500: REQUEST create table pics FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST create table pics FAIL' });
			break;
		case 6:
			res.status(401).json({ message: 'Too mutch pictures remove one before add another picture' });
			// console.log('Unauthorized 401 : Too mutch pictures remove one before add another picture');
			break;
		case 7:
			// console.log('Internal Server Error 500: REQUEST nb_pics_validation FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST nb_pics_validation FAIL' });
			break;
		case 8:
			// console.log('Internal Server Error 500: REQUEST add_path (pics) FAIL');
			res.status(500).json({ message: 'Internal Server Error 500: REQUEST add_path (pics) FAIL' });
			break;
		default:
			// console.log('Internal Server Error 500: unknow error');
			res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});


module.exports = router;
