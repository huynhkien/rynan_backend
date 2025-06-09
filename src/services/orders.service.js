const Order = require('../models/order.model');
const asyncHandler = require('express-async-handler');

// Tạo đơn hàng
const addOrder = asyncHandler(async(data) => {
    await Order.create(data);
});
// Cập nhật trạng thái đơn hàng
const updateOrder = asyncHandler(async(id, status) => {
    await Order.findByIdAndUpdate(id, status, {new: true});
});
// Tìm đơn hàng theo id
const findOrderById = asyncHandler(async(id) => {
    await Order.findById({_id: id});
});
// Tìm tất cả các đơn hàng
const findAllOrder = asyncHandler(async() => {
    await Order.find();
});
// Xóa đơn hàng
const deleteOrder = asyncHandler(async(id) => {
    await Order.findByIdAndDelete({_id: id});
});

module.exports = {
    addOrder,
    updateOrder,
    findAllOrder,
    findOrderById,
    deleteOrder
}
