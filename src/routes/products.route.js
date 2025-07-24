const productsController = require('../controllers/products.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();
const uploader = require('../config/connectCloudinary');


router.route('/')
            .post([verifyAccessToken, checkUserPermission],uploader.single('thumb'), productsController.addProduct)
            .get(productsController.findAllProduct);

router.route('/add-rating/').put(productsController.addRating);
router.route('/delete-products').delete(productsController.deleteProducts);
router.route('/:pid')
            .get(productsController.findProductById)
            .put([verifyAccessToken, checkUserPermission],uploader.single('thumb'), productsController.updateProduct)
            .delete([verifyAccessToken, checkUserPermission],productsController.deleteProduct);


router.route('/add-reply/:pid/:rid').post(productsController.addReply);
router.route('/add-reply-child/:pid/:cid').post(productsController.addReplyChild);
            
router.route('/update-description/:pid').put([verifyAccessToken, checkUserPermission],productsController.updateDescriptionProduct);
router.route('/add-price/:pid').put([verifyAccessToken, checkUserPermission],productsController.addPriceProduct);

router.route('/update-price/:pid/:rid').put([verifyAccessToken, checkUserPermission],productsController.updatePriceProduct);
router.route('/add-update-price/:pid').put([verifyAccessToken, checkUserPermission],productsController.addAndUpdatePriceProduct);
router.route('/delete-rating/:pid/:rid').delete([verifyAccessToken, checkUserPermission],productsController.deleteRating);
router.route('/detail/:slug').get(productsController.findProductBySlug);
router.route('/delete-reply/:pid/:rid/:repId').delete([verifyAccessToken, checkUserPermission],productsController.deleteReply);

module.exports = router;
