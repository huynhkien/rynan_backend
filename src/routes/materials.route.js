const materialsController = require('../controllers/materials.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post([verifyAccessToken, checkUserPermission], materialsController.addMaterial)
            .get([verifyAccessToken, checkUserPermission], materialsController.findAllMaterial);
router.route('/:mid')
            .get([verifyAccessToken, checkUserPermission], materialsController.findMaterialById)
            .put([verifyAccessToken, checkUserPermission], materialsController.updateMaterial)
            .delete([verifyAccessToken, checkUserPermission], materialsController.deleteMaterial);

module.exports = router;
