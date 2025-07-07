const receiptController = require('../controllers/receipts.controller');
const express = require('express');
const router = express.Router();


router.route('/').get(receiptController.findAllReceipt);
router.route('/create-import-receipt').post(receiptController.addImportReceipt);
router.route('/create-export-receipt').post(receiptController.addExportReceipt);

router.route('/:rid')
            .get(receiptController.findReceiptById)
            .put(receiptController.updateReceipt)
            .delete(receiptController.deleteReceipt);

router.route('/update-product-receipt/:rid/:pid').put(receiptController.updateProductReceipt);
router.route('/update-material-receipt/:rid/:mid').put(receiptController.updateMaterialReceipt);
router.route('/delete-product-receipt/:rid/:pid').delete(receiptController.deleteProductReceipt);
router.route('/delete-material-receipt/:rid/:mid').delete(receiptController.deleteMaterialReceipt);

module.exports = router;
