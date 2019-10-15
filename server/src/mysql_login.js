const mysql = require('mysql');
const util = require('util');
const dbConfig = require('./mysql_info');

getInstance = () => {
	const connection = mysql.createConnection({
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
	});
	const pool = mysql.createPool({
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
		database: dbConfig.database
	});

	connection.connect((err) => {
		if (err) {
			console.log('Connection MySQl totaly fail maybe open the server');
		}
	});
	const sql = 'CREATE DATABASE IF NOT EXISTS `matcha` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci';
	connection.query(sql, function (err, res) {
		if (err) {
			console.log('Query Create database totaly fail');
		}
		else {
			connection.end();
			co_db();
		}
	});

	function co_db() {
		pool.getConnection((err, connection) => {
			if (err) {
				if (err.code === 'PROTOCOL_CONNECTION_LOST') {
					console.error('Database connection was closed.')
				}
				if (err.code === 'ER_CON_COUNT_ERROR') {
					console.error('Database has too many connections.')
				}
				if (err.code === 'ECONNREFUSED') {
					console.error('Database connection was refused.')
				}
			}
			else {
				if (connection) {
					console.log('Connection to MySql OPEN');
					connection.release();
				}
				else
					console.log('ERRER NO Connection Pool to MySql');
			}
		});
	}
	return pool;
}

const pool = getInstance();
pool.query = util.promisify(pool.query);
exports.pool = pool;
