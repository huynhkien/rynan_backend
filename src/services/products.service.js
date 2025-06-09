const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm
const addProduct = asyncHandler(async(data) => {
    await Product.create(data);
});
// Cập nhật sản phẩm
const updateProduct = asyncHandler(async(id, data) => {
    await Product.findByIdAndUpdate(id, data, {new: true});
});
// Tìm sản phẩm theo id
const findProductById = asyncHandler(async(id) => {
    await Product.findById(id);
});
// Tìm tất cả sản phẩm
const findAllProduct = asyncHandler(async() => {
    await Product.find();
})
// Xóa sản phẩm
const deleteProduct = asyncHandler(async(id) => {
    await Product.findByIdAndDelete({_id: id})
})
// Tìm sản phẩm theo slug
const findProductBySlug = asyncHandler(async(slug) => {
    await Product.findOne(slug)
})

module.exports = {
    addProduct,
    updateProduct,
    findProductById, 
    findAllProduct,
    deleteProduct,
    findProductBySlug
}
