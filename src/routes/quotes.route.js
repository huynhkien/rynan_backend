const quotesController = require('../controllers/quotes.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post(quotesController.addQuote)
            .get(quotesController.findAllQuote);
router.route('/:qid')
            .get(quotesController.findQuoteById)
            .put(quotesController.updateQuote)
            .delete(quotesController.deleteQuote);
router.route('/delete-product-quote/:qid/:pid')
            .delete(quotesController.deleteProductQuote)

module.exports = router;
