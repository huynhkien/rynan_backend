const Inventory = require('../models/inventory.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm vào kho
const addProductInventory = asyncHandler(async(data, session) => {
    const result = await Inventory.create([data], {session});
    return result[0];
});
// Cập nhật tồn kho
const updateInventory = asyncHandler(async({id, data}, session) => {
    
    return await Inventory.findByIdAndUpdate(
        id, data,
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
    updateInventory,
    findAllInventory,
    findProductInventory

}