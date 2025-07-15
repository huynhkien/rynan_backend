const contactsController = require('../controllers/contacts.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post(contactsController.addContact)
            .get(contactsController.findAllContact);
router.route('/:cid')
            .get(contactsController.findContactById)
            .delete(contactsController.deleteContact);

router.route('/send-mail').post(contactsController.sendMailContact);

module.exports = router;
