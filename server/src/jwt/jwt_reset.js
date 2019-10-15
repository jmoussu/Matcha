const jwt = require('jsonwebtoken');

let JWT_SIGN_SECRET = '4yUqQLNhp27oR8GjsYEXXf5PGEO9WV6om19eA4r56ZWWZA89aAw7OnQpan5bM41X';
// utiliser le hash du old password pour signé le token

const generateTokenForUser = async (userData) => {
	let JWT_SIGN_SECRET = '4yUqQLNhp27oR8GjsYEXXf5PGEO9WV6om19eA4r56ZWWZA89aAw7OnQpan5bM41X';
	JWT_SIGN_SECRET = userData.password + JWT_SIGN_SECRET;
	return jwt.sign(
		{
			userId: userData.id
		},
		JWT_SIGN_SECRET,
		{
			expiresIn: '20m'
		}
	)
}

const verifyUser = async (token, oldPassword) => {
	JWT_SIGN_SECRET = '4yUqQLNhp27oR8GjsYEXXf5PGEO9WV6om19eA4r56ZWWZA89aAw7OnQpan5bM41X';
	let userId = -1;
	if (token != null) {
		try {
			token = token.replace('Bearer ', '');
			const jwtToken = await jwt.verify(token, oldPassword + JWT_SIGN_SECRET);
			if (jwtToken != null) {
				userId = jwtToken.userId;
				return userId;
			}
			else
				return -1;
		}
		catch (err) {
			// console.log("verifyUser JWT_reset fail");
			return -1;
		}
	}
	return -1;
}

module.exports.verifyUser = verifyUser;
module.exports.generateTokenForUser = generateTokenForUser;
