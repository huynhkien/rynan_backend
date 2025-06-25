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
            .put(uploader.single('thumb'), productsController.updateProduct)
            .delete(productsController.deleteProduct);
router.route('/update-description/:pid').put(productsController.updateDescriptionProduct);
router.route('/add-price/:pid').put(productsController.addPriceProduct);
router.route('/update-price/:pid/:rid').put(productsController.updatePriceProduct);
router.route('/delete-price/:pid/:rid').delete(productsController.deletePriceProduct);
router.route('/:slug').get(productsController.findProductBySlug);

module.exports = router;
