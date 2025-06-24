const productsController = require('../controllers/products.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();
const uploader = require('../config/connectCloudinary');


router.route('/')
            .post(uploader.single('thumb'), productsController.addProduct)
            .get(productsController.findAllProduct);

router.route('/:pid')
            .get(productsController.findProductById)
            .put([verifyAccessToken, checkUserPermission], productsController.updateProduct)
            .delete(productsController.deleteProduct);

router.route('/:slug').get(productsController.findProductBySlug);

module.exports = router;
