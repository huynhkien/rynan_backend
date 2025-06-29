const quotesController = require('../controllers/quotes.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post(quotesController.addQuote)
            .get(quotesController.findAllQuote);
router.route('/:qid')
            .get(quotesController.findQuoteById)
            .put([verifyAccessToken, checkUserPermission], quotesController.updateQuote)
            .delete([verifyAccessToken, checkUserPermission], quotesController.deleteQuote);


module.exports = router;
