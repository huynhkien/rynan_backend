const suppliersController = require('../controllers/suppliers.controller');
const express = require('express');
const router = express.Router();
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');


router.route('/')
            .post([verifyAccessToken, checkUserPermission],suppliersController.addSupplier)
            .get([verifyAccessToken, checkUserPermission],suppliersController.findAllSupplier);
router.route('/:sid')
            .get([verifyAccessToken, checkUserPermission],suppliersController.findSupplierById)
            .put([verifyAccessToken, checkUserPermission],suppliersController.updateSupplier)
            .delete([verifyAccessToken, checkUserPermission],suppliersController.deleteSupplier);

module.exports = router;
