const receiptController = require('../controllers/receipts.controller');
const express = require('express');
const router = express.Router();
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');


router.route('/').get([verifyAccessToken, checkUserPermission],receiptController.findAllReceipt);
router.route('/create-import-receipt').post([verifyAccessToken, checkUserPermission],receiptController.addImportReceipt);
router.route('/create-export-receipt').post([verifyAccessToken, checkUserPermission],receiptController.addExportReceipt);

router.route('/:rid')
            .get([verifyAccessToken, checkUserPermission],receiptController.findReceiptById)
            .put([verifyAccessToken, checkUserPermission],receiptController.updateReceipt)
            .delete([verifyAccessToken, checkUserPermission],receiptController.deleteReceipt);

router.route('/update-product-receipt/:rid/:pid').put([verifyAccessToken, checkUserPermission],receiptController.updateProductReceipt);
router.route('/update-material-receipt/:rid/:mid').put([verifyAccessToken, checkUserPermission],receiptController.updateMaterialReceipt);
router.route('/delete-product-receipt/:rid/:pid').delete([verifyAccessToken, checkUserPermission],receiptController.deleteProductReceipt);
router.route('/delete-material-receipt/:rid/:mid').delete([verifyAccessToken, checkUserPermission],receiptController.deleteMaterialReceipt);

module.exports = router;
