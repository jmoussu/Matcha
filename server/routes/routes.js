const express = require('express');
const router = express.Router();
const path = require('path');

router.use('/', require('./root'));
router.use('/test', require('./test'));
router.use('/test_db', require('./test_db'));
router.use('/install', require('./install'));
router.use('/seed', require('./seed'));

router.use('/accounts/', require('./accounts/root'));
router.use('/accounts/get', require('./accounts/get'));
router.use('/accounts/sign_up', require('./accounts/sign_up'));
router.use('/accounts/sign_in', require('./accounts/sign_in'));
router.use('/accounts/verif_email', require('./accounts/verif_email'));
router.use('/accounts/verif_registration_token', require('./accounts/verif_registration_token'));
router.use('/accounts/relog', require('./accounts/relog'));

router.use('/accounts/password_reset/', require('./accounts/password_reset/root'));
router.use('/accounts/password_reset/send_email', require('./accounts/password_reset/send_email'));
router.use('/accounts/password_reset/change_password', require('./accounts/password_reset/change_password'));

router.use('/accounts/update/', require('./accounts/update/root'));
router.use('/accounts/update/info', require('./accounts/update/info'));
router.use('/accounts/update/password', require('./accounts/update/password'));
router.use('/accounts/update/preferences', require('./accounts/update/preferences'));
router.use('/accounts/update/bio', require('./accounts/update/bio'));
router.use('/accounts/update/localisation', require('./accounts/update/localisation'));

router.use('/accounts/update/tags/', require('./accounts/update/tags/root'));
router.use('/accounts/update/tags/add', require('./accounts/update/tags/add'));
router.use('/accounts/update/tags/remove', require('./accounts/update/tags/remove'));

router.use('/accounts/update/pics/', require('./accounts/update/pics/root'));
router.use('/accounts/update/pics/add', require('./accounts/update/pics/add'));
router.use('/accounts/update/pics/remove', require('./accounts/update/pics/remove'));
router.use('/accounts/update/pics/set_avatar', require('./accounts/update/pics/set_avatar'));


router.use('/tags/', require('./tags/root'));
router.use('/tags/get_tags', require('./tags/get_tags'));
router.use('/tags/get_user_tags', require('./tags/get_user_tags'));

router.use('/pics/', require('./pics/root'));
router.use('/pics/get_user_pics', require('./pics/get_user_pics'));

router.use('/visits/', require('./visits/root'));
router.use('/visits/add', require('./visits/add'));

router.use('/likes/', require('./likes/root'));
router.use('/likes/add', require('./likes/add'));
router.use('/likes/remove', require('./likes/remove'));

router.use('/blocks/', require('./blocks/root'));
router.use('/blocks/add', require('./blocks/add'));

router.use('/research/', require('./research/root'));
router.use('/research/find', require('./research/find'));

router.use('/notifications/', require('./notifications/root'));
router.use('/notifications/set_read', require('./notifications/set_read'));

router.use('/history/', require('./history/root'));
router.use('/history/likes', require('./history/likes'));
router.use('/history/visits', require('./history/visits'));

router.use('/chats/', require('./chats/root'));
router.use('/chats/add', require('./chats/add'));
router.use('/chats/get', require('./chats/get'));

router.use('/uploads', express.static(path.join(__dirname,'/../uploads')));

module.exports = router;
