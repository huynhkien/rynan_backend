const OrderController = require('../controllers/orders.controller');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.route('/')
            .post(OrderController.addOrder)
            .get(OrderController.findAllOrder);


router.route('/:oid')
            .put([verifyAccessToken, checkUserPermission],OrderController.updateOrder)
            .get(OrderController.findOrderById);
            
router.route('/update-status-by-admin/:oid').put([verifyAccessToken, checkUserPermission], OrderController.updateStatusOrderByAdmin)
router.route('/update-status-by-user/:oid').put(verifyAccessToken, OrderController.updateStatusOrderByUser)
router.route('/delete-product-order/:oid/:pid').delete([verifyAccessToken, checkUserPermission], OrderController.deleteProductOrder)
router.route('/update-product-order/:oid/:pid').put([verifyAccessToken, checkUserPermission],OrderController.updateProductOrder)

module.exports = router;