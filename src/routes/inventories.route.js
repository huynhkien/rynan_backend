const inventoriesController = require('../controllers/inventories.controller');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');

const express = require('express');
const router = express.Router();


router.route('/').get(inventoriesController.findAllInventory)
                 .post([verifyAccessToken, checkUserPermission], inventoriesController.addInventory);
                 
router.route('/remove-inventory').put([verifyAccessToken, checkUserPermission], inventoriesController.removeInventory);

module.exports = router;
