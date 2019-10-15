const express = require('express');
const router = express.Router();
const get_user_tags = require("../../src/get_user_tags");

router.get('/:id_user', async (req, res) =>{
	const id_user = req.params.id_user;

	const tags = await get_user_tags(id_user);

	async function get_user_tags_main() {
		if (tags === -1)
			return 1;
		return 0;
	}

	let err = await get_user_tags_main();
	if (err == 0) {
		res.status(200).json({ tags: tags });
		// console.log('OK 200 : get_user_tags sucsess');
		return;
	}
	else if (err == 1) {
		res.status(500).json({ message: 'Internal Server Error 500: REQUEST get_user_tag FAIL' });
		// console.log('Internal Server Error 500: REQUEST get_user_tag FAIL');
		return;
	}
	else {
		// console.log('Internal Server Error 500: unknow error');
		res.status(500).json({ message: 'Internal Server Error 500: unknow error' });
	}
});

module.exports = router;
