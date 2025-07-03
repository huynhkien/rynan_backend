const suppliersController = require('../controllers/suppliers.controller');
const express = require('express');
const router = express.Router();


router.route('/')
            .post(suppliersController.addSupplier)
            .get(suppliersController.findAllSupplier);
router.route('/:sid')
            .get(suppliersController.findSupplierById)
            .put(suppliersController.updateSupplier)
            .delete(suppliersController.deleteSupplier);

module.exports = router;
