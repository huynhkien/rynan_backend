const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm
const addProduct = asyncHandler(async(data) => {
    return await Product.create(data);
});
// Cập nhật sản phẩm
const updateProduct = asyncHandler(async(id, data) => {
    return await Product.findByIdAndUpdate(id, data, {new: true});
});
// Cập nhật lượt bán sản phẩm
const updateSoldProduct = asyncHandler(async(id, sold) => {
    return await Product.findByIdAndUpdate(id, {$inc: {sold: sold}}, {new: true})
});
// Tìm sản phẩm theo id
const findProductById = asyncHandler(async(id) => {
    return await Product.findById(id);
});
// Tìm tất cả sản phẩm
const findAllProduct = asyncHandler(async() => {
    return await Product.find();
})
// Xóa sản phẩm
const deleteProduct = asyncHandler(async(id) => {
    return await Product.findByIdAndDelete({_id: id})
})
// Tìm sản phẩm theo slug
const findProductBySlug = asyncHandler(async(slug) => {
    return await Product.findOne(slug)
})

module.exports = {
    addProduct,
    updateProduct,
    findProductById, 
    findAllProduct,
    deleteProduct,
    findProductBySlug,
    updateSoldProduct,
}
