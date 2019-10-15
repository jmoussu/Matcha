const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function (req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.status(200).sendFile(path.join(__dirname+'./../../view/notifications.html'));
});

module.exports = router;
