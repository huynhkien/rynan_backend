const categoriesController = require('../controllers/categories.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();
const uploader = require('../config/connectCloudinary');


router.route('/')
            .post(uploader.single('thumb'), categoriesController.addCategory)
            .get(categoriesController.findAllCategory);
router.route('/:cid')
            .get(categoriesController.findCategoryById)
            .put([verifyAccessToken, checkUserPermission], categoriesController.updateCategory)
            .delete([verifyAccessToken, checkUserPermission], categoriesController.deleteCategory);

router.route('/slug/:slug').get(categoriesController.findCategoryBySlug);

module.exports = router;
