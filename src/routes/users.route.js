const usersController = require('../controllers/users.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();

router.route('/').get(usersController.findAllUser);
router.route('/register').get(usersController.register);
router.route('/final-register').post(usersController.finalRegister);

router.route('/:uid')
            .get(usersController.findUserById)
            .put([verifyAccessToken, checkUserPermission],usersController.updateInfoByAdmin);

router.route('/find-user').get(usersController.findUserByToken);

router.route('/login').get(usersController.login);
router.route('/logout').get(usersController.logout);

router.route('/forgot-password').get(usersController.forgotPassword);
router.route('/reset-password').put(usersController.resetPassword);

router.route('/update-user').put(usersController.updateInfoByUser);
router.route('/update-address').put(usersController.updateAddress);

module.exports = router;
