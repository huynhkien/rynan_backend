const quotesController = require('../controllers/quotes.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post([verifyAccessToken, checkUserPermission],quotesController.addQuote)
            .get([verifyAccessToken, checkUserPermission],quotesController.findAllQuote);
router.route('/delete-quotes').delete([verifyAccessToken, checkUserPermission],quotesController.deleteQuotes)
router.route('/:qid')
            .get([verifyAccessToken, checkUserPermission],quotesController.findQuoteById)
            .put([verifyAccessToken, checkUserPermission],quotesController.updateQuote)
            .delete([verifyAccessToken, checkUserPermission],quotesController.deleteQuote);
router.route('/delete-product-quote/:qid/:pid')
            .delete([verifyAccessToken, checkUserPermission],quotesController.deleteProductQuote)

module.exports = router;
