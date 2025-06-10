const OrderController = require('../controllers/orders.controller');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.route('/')
            .post([verifyAccessToken],OrderController.addOrder)
            .get([verifyAccessToken, checkUserPermission],OrderController.findAllOrder);


router.route('/:oid')
            .put([verifyAccessToken], OrderController.updateOrder)
            .get([verifyAccessToken], OrderController.findOrderById);

module.exports = router;