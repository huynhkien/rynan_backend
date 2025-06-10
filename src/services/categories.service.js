const Category = require('../models/category.model');
const asyncHandler = require('express-async-handler');
// thêm danh mục
const addCategory = asyncHandler(async(data) => {
    return await Category.create(data);
})
// Cập nhật danh mục
const updateCategory = asyncHandler(async(id, data) => {
    return await Category.findByIdAndUpdate(id, data, {new: true});
})
// Tìm danh mục theo id
const findCategoryById = asyncHandler(async(id) => {
    return await Category.findById({_id: id});
})
// Tìm tất cả các danh mục
const findAllCategory = asyncHandler(async() => {
    return await Category.find();
})
// Xóa danh mục
const deleteCategory = asyncHandler(async(id) => {
    return await Category.findByIdAndDelete({_id: id})
})
// Tìm danh mục theo slug
const findCategoryBySlug = asyncHandler(async(slug) => {
    return await Category.findOne(slug)
})
module.exports = {
    addCategory,
    updateCategory,
    findCategoryBySlug,
    findCategoryById,
    findAllCategory,
    deleteCategory,
}