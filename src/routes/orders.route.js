const OrderController = require('../controllers/orders.controller');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.route('/')
            .post(OrderController.addOrder)
            .get(OrderController.findAllOrder);


router.route('/:oid')
            .put(OrderController.updateOrder)
            .get(OrderController.findOrderById);
router.route('/delete-product-order/:oid/:pid').delete(OrderController.deleteProductOrder)
router.route('/update-product-order/:oid/:pid').put(OrderController.updateProductOrder)

module.exports = router;