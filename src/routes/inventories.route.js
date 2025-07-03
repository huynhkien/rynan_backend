const inventoriesController = require('../controllers/inventories.controller');
const express = require('express');
const router = express.Router();


router.route('/').get(inventoriesController.findAllInventory)

module.exports = router;
