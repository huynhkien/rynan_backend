const usersController = require('../controllers/users.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();
const uploader = require('../config/connectCloudinary');

router.route('/').get(usersController.findAllUser);
router.route('/logout').get(verifyAccessToken, usersController.logout);
router.route('/forgot-password').post(usersController.forgotPassword);
router.route('/reset-password').put(usersController.resetPassword);
router.route('/register').post(usersController.register);
router.route('/final-register/:token').get(usersController.finalRegister);

router.route('/add-role').post([verifyAccessToken, checkUserPermission],uploader.single('avatar'), usersController.addRole);
router.route('/:uid')
            .get([verifyAccessToken, checkUserPermission],usersController.findUserById)
            .put(verifyAccessToken,uploader.single('avatar'),usersController.updateInfoByAdmin)
            .delete([verifyAccessToken, checkUserPermission],usersController.deleteUser);

router.route('/find-user').get(verifyAccessToken,usersController.findUserByToken);

router.route('/login').post(usersController.login);

router.route('/update-user/:uid').put(verifyAccessToken,uploader.single('avatar'),usersController.updateInfoByUser);
router.route('/add-user').post([verifyAccessToken, checkUserPermission], uploader.single('avatar'), usersController.addUserByAdmin);
router.route('/update-address').put(verifyAccessToken,usersController.updateAddress);
router.route('/check-mail').post(usersController.checkMail);
router.route('/add-favorite').post(usersController.addFavorite);
module.exports = router;
