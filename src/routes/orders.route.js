const OrderController = require('../controllers/orders.controller');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.route('/')
            .post([verifyAccessToken],OrderController.addOrder)
            .get(OrderController.findAllOrder);


router.route('/:oid')
            .put([verifyAccessToken], OrderController.updateOrder)
            .get([verifyAccessToken], OrderController.findOrderById);

module.exports = router;