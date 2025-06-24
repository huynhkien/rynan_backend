const specificationsController = require('../controllers/specifications.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post(specificationsController.addSpecification)
            .get(specificationsController.findAllSpecification);
router.route('/:sid')
            .get(specificationsController.findSpecificationById)
            .put(specificationsController.updateSpecification)
            .delete(specificationsController.deleteSpecification);

module.exports = router;
