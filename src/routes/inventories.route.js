const inventoriesController = require('../controllers/inventories.controller');
const express = require('express');
const router = express.Router();


router.route('/').get(inventoriesController.findAllInventory)
                 .post(inventoriesController.addInventory);
                 
router.route('/remove-inventory').put(inventoriesController.removeInventory);

module.exports = router;
