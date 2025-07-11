const usersController = require('../controllers/users.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();
const uploader = require('../config/connectCloudinary');

router.route('/').get(usersController.findAllUser);
router.route('/register').post(usersController.register);
router.route('/final-register/:token').get(usersController.finalRegister);

router.route('/:uid')
            .get(usersController.findUserById)
            .put(usersController.updateInfoByAdmin)
            .delete(usersController.deleteUser);

router.route('/find-user').get(usersController.findUserByToken);

router.route('/login').post(usersController.login);
router.route('/logout').get(usersController.logout);

router.route('/forgot-password').get(usersController.forgotPassword);
router.route('/reset-password').put(usersController.resetPassword);

router.route('/update-user').put(usersController.updateInfoByUser);
router.route('/add-user').post(uploader.single('avatar'), usersController.addUserByAdmin);
router.route('/update-address').put(usersController.updateAddress);
router.route('/add-role').post(usersController.addRole);

module.exports = router;
