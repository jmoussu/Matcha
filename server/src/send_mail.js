const mailer = require("nodemailer");

async function send_mail(to, subject, html_body) {
	const smtpTransport = mailer.createTransport({
		service: "gmail",
		auth: {
			user: "matcha.bj.42@gmail.com",
			pass: "Admin123!"
		},
		secure: true, // use TLS
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		}
	});
	const mail = {
		from: "matcha.bj.42@gmail.com",
		to: to,
		subject: subject,
		html: html_body
	};
	await smtpTransport.sendMail(mail, function (err, res) {
		if (err) {
			// console.log("Erreur lors de l'envoie du mail!");
			return 1;
		}
		else {
			// console.log("Mail envoyé avec succès!")
		}
		smtpTransport.close();
	});
}

module.exports = send_mail;
