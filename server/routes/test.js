const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({ message: 'Test de connection a l\'api OK' })
	// console.log('Test de connection a l\'api OK');
});

module.exports = router;
