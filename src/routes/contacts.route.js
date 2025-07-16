const contactsController = require('../controllers/contacts.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post(contactsController.addContact)
            .get(contactsController.findAllContact);
router.route('/:cid')
            .get([verifyAccessToken, checkUserPermission], contactsController.findContactById)
            .delete([verifyAccessToken, checkUserPermission], contactsController.deleteContact);

router.route('/send-mail').post([verifyAccessToken, checkUserPermission], contactsController.sendMailContact);

module.exports = router;
