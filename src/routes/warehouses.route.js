const WarehouseController = require('../controllers/warehouses.controller');
const express = require('express');

const router = express.Router();
router.route('/').post(WarehouseController.addWarehouse)