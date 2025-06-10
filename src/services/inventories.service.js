const Inventory = require('../models/inventory.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm vào kho
const addProductInventory = asyncHandler(async(data, session) => {
    const result = await Inventory.create([data], {session});
    return result[0];
});
// Cập nhật số lượng sản phẩm tồn kho
const updateProductQuantityInventory = asyncHandler(async({id, quantity, operation}, session) => {
    const updateQuantity = operation === 'add' ? quantity : -quantity;
    return await Inventory.findByIdAndUpdate(
        {productId: id},
        {
            $inc: {quantity: updateQuantity},
            lastUpdated: Date.now()
        },
        {new: true, session, runValidators: true}
    );
});
// Truy xuất thông tin sản phẩm trong kho
const findProductInventory = asyncHandler(async(id, session) => {
    return await Inventory.findOne({ productId: id }, null, {session});
});
// Truy xuất sản phẩm trong kho
const findAllInventory = asyncHandler(async() => {
    return await Inventory.find();
});
module.exports = {
    addProductInventory,
    updateProductQuantityInventory,
    findAllInventory,
    findProductInventory

}