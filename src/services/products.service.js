const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm
const addProduct = asyncHandler(async(data) => {
    return await Product.create(data);
});
// Tìm sản phẩm theo id
const findProductById = asyncHandler(async(id) => {
    return await Product.findById(id);
});
// Tìm tất cả sản phẩm
const findAllProduct = asyncHandler(async() => {
    return await Product.find();
})
// Cập nhật sản phẩm
const updateProduct = asyncHandler(async(id, data) => {
    return await Product.findByIdAndUpdate(id, data, {new: true});
});
// Cập nhật bài viết sản phẩm
const updateDescriptionProduct = asyncHandler(async(id, description) => {
    return await Product.findByIdAndUpdate(id, {description}, {new: true});
});
// Thêm giá tiền cho sản phẩm
const AddPriceProduct = asyncHandler(async(id, newPrice) => {
    return await Product.findByIdAndUpdate(id,{ $push: { prices: newPrice } }, {new: true});
});
// Cập nhật giá tiền sản phẩm
const updatePriceProduct = asyncHandler(async({pid, rid, updatePrice}) => {
    const product = await findProductById(pid);
    console.log(rid);
    if(!product) throw new Error('Không tìm thấy sản phẩm');
    const productPriceIndex = product.prices.findIndex(item => item._id.toString() === rid);
    console.log(productPriceIndex)
    if(productPriceIndex === -1) throw new Error('Không tìm thấy giá tiền của sản phẩm');
    const updateData = {
        ...product.prices[productPriceIndex].toObject(),
        ...updatePrice
    }
    product.prices[productPriceIndex] = updateData;
    return product.save();
});
// Xóa thông tin giá tiền trong sản phẩm
const deletePriceProduct = asyncHandler(async(pid, rid) => {
    return await Product.findByIdAndUpdate(
        pid,
        {$pull: {prices: {_id: rid}}},
        {new: true}
    )
})
// Cập nhật lượt bán sản phẩm
const updateSoldProduct = asyncHandler(async(id, sold) => {
    return await Product.findByIdAndUpdate(id, {$inc: {sold: sold}}, {new: true})
});

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
    updateDescriptionProduct,
    AddPriceProduct,
    updatePriceProduct,
    deletePriceProduct
}
