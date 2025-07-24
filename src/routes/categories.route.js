const categoriesController = require('../controllers/categories.controller');
const express = require('express');
const {verifyAccessToken, checkUserPermission} = require('../middlewares/auth');
const router = express.Router();
const uploader = require('../config/connectCloudinary');


router.route('/')
            .post([verifyAccessToken, checkUserPermission],uploader.single('thumb'), categoriesController.addCategory)
            .get(categoriesController.findAllCategory);
router.route('/delete-categories').delete(categoriesController.deleteCategories);

router.route('/:cid')
            .get([verifyAccessToken, checkUserPermission], categoriesController.findCategoryById)
            .put([verifyAccessToken, checkUserPermission],uploader.single('thumb'), categoriesController.updateCategory)
            .delete([verifyAccessToken, checkUserPermission], categoriesController.deleteCategory);

router.route('/slug/:slug').get(categoriesController.findCategoryBySlug);

module.exports = router;
