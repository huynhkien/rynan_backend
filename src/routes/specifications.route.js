const specificationsController = require('../controllers/specifications.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();


router.route('/')
            .post([verifyAccessToken, checkUserPermission],specificationsController.addSpecification)
            .get([verifyAccessToken, checkUserPermission],specificationsController.findAllSpecification);

router.route('/delete-specifications').delete(specificationsController.deleteSpecifications);

router.route('/:sid')
            .get([verifyAccessToken, checkUserPermission],specificationsController.findSpecificationById)
            .put([verifyAccessToken, checkUserPermission],specificationsController.updateSpecification)
            .delete([verifyAccessToken, checkUserPermission],specificationsController.deleteSpecification);

module.exports = router;
