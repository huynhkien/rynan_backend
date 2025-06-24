const CategoryService = require('../services/categories.service');
const asyncHandler = require('express-async-handler');
// Thêm danh mục
const addCategory = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin danh mục');
    const thumb = req.file ? req.file.path : null;
    if(thumb) req.body.thumb = {
        url: req.file.path,
        public_id: req.file.filename
    }
    const response = await CategoryService.addCategory(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm danh mục thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm danh mục thành công'
    });
});
// Cập nhật danh mục
const updateCategory = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    console.log(req.body);
    const thumb = req.file ? req.file.path : null;
    if(thumb) req.body.thumb = {
        url: req.file.path,
        public_id: req.file.filename
    }
    const response = await CategoryService.updateCategory(cid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật danh mục thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật danh mục thành công'
    });
});
// Tìm danh mục theo id
const findCategoryById = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    const response = await CategoryService.findCategoryById(cid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy danh mục'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm danh mục theo slug
const findCategoryBySlug = asyncHandler(async(req, res) => {
    const {slug} = req.params;
    const response = await CategoryService.findCategoryById(slug);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy danh mục'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các danh mục
const findAllCategory = asyncHandler(async(req, res) => {
    const response = await CategoryService.findAllCategory();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy danh mục'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa danh mục
const deleteCategory = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    const response = await CategoryService.deleteCategory(cid);
    console.log(response)
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa danh mục thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa danh mục thành công'
    });
});
module.exports = {
    addCategory,
    updateCategory,
    findCategoryById,
    findCategoryBySlug,
    findAllCategory,
    deleteCategory
}

