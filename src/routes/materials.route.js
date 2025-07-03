const materialsController = require('../controllers/materials.controller');
const express = require('express');
const router = express.Router();


router.route('/')
            .post(materialsController.addMaterial)
            .get(materialsController.findAllMaterial);
router.route('/:mid')
            .get(materialsController.findMaterialById)
            .put(materialsController.updateMaterial)
            .delete(materialsController.deleteMaterial);

module.exports = router;
