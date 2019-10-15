async function searchPreferences_conversion(value) {
	if (typeof value === 'object' && value !== null)
	{
		let ret = 0;
		if (value.male === true)
			ret += 4;
		if (value.female === true)
			ret += 2;
		if (value.other === true)
			ret += 1;
		return ret;
	}
	const searchPreferences = {
		"male": false,
		"female": false,
		"other": false
	};
	if (value <= 0 || value >= 8)
		return searchPreferences;
	if (value >= 4) {
		searchPreferences.male = true;
		value -= 4;
	}
	if (value >= 2) {
		searchPreferences.female = true;
		value -= 2;
	}
	if (value >= 1) {
		searchPreferences.other = true;
		value -= 1;
	}
	// console.log(searchPreferences);
	return searchPreferences;
}

module.exports = searchPreferences_conversion;
