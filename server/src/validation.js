const emailValidation = async (email) => (
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
)

const passwordValidation = async (password) => (
	/(?=^.{8,16}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password)
)

const firstnameValidation = async (firstname) => (
	firstname.length >= 2 && firstname.length <= 24  && /^[a-z,.'-]{2,32}$/i.test(firstname)
)

const lastnameValidation = async (lastname) => (
	lastname.length >= 2 && lastname.length <= 24 && /^[a-z,.'-]{2,32}$/i.test(lastname)
)

const genderValidation = async (gender) => (
	gender == "male" || gender == "female" || gender == "other"
)
const ageValidation = async (age) => (
	age >= 16 && age <= 80
)
const prefValidation = async (pref) => (
	typeof pref.male === "boolean" && typeof pref.other === "boolean" && typeof pref.other === "boolean"
)
const bioValidation = async (bio) => (
	bio.length >= 0 && bio.length <= 255
)
const tagValidation = async (tag) => (
	tag.length >= 1 && tag.length <= 10
)

module.exports.emailValidation = emailValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.firstnameValidation = firstnameValidation;
module.exports.lastnameValidation = lastnameValidation;
module.exports.genderValidation = genderValidation;
module.exports.ageValidation = ageValidation;
module.exports.prefValidation = prefValidation;
module.exports.bioValidation = bioValidation;
module.exports.tagValidation = tagValidation;
