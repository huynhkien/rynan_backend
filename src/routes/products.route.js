const productsController = require('../controllers/products.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post([verifyAccessToken, checkUserPermission], productsController.addProduct)
            .get(productsController.findAllProduct);

router.route('/:pid')
            .get(productsController.findProductById)
            .put([verifyAccessToken, checkUserPermission], productsController.updateProduct)
            .delete([verifyAccessToken, checkUserPermission], productsController.deleteProduct);

router.route('/:slug').get(productsController.findProductBySlug);

module.exports = router;
