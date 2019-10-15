const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'Wp0jFmN5ElKAlzvTT7KWvJnfoTcwT4AQjKTE3wKnc2XgaL65jdlyyUQmOG9kqBgB';

const generateTokenForUser = async (userData) => {
	const JWT_SIGN_SECRET = 'Wp0jFmN5ElKAlzvTT7KWvJnfoTcwT4AQjKTE3wKnc2XgaL65jdlyyUQmOG9kqBgB';
	return jwt.sign(
		{
			userId: userData.id
		},
		JWT_SIGN_SECRET,
		{
			expiresIn: '24h'
		}
	)
}

const verifyUser = async (token) => {
	const JWT_SIGN_SECRET = 'Wp0jFmN5ElKAlzvTT7KWvJnfoTcwT4AQjKTE3wKnc2XgaL65jdlyyUQmOG9kqBgB';
	let userId = -1;
	if (token != null) {
		try {
			token = token.replace('Bearer ', '');
			jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
			if (jwtToken != null) {
				userId = jwtToken.userId;
				return userId;
			}
			else
				return -1;
		}
		catch (err) {
			// console.log("verifyUser JWT validation fail");
			return -1;
		}
	}
	return -1;
}

module.exports.verifyUser = verifyUser;
module.exports.generateTokenForUser = generateTokenForUser;

/* 
	const jwt = require('./src/jwt');
	// console.log(jwt.verifyUser('Bearer <token>'));

const UserId = jwt.verifyUser(req.headers['authorization'])

if (userId < 1)
	return res.status(400).json({ message: "JWT"})


 */
