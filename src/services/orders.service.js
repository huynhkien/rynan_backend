const Order = require('../models/order.model');
const ProductService = require('./products.service');
const InventoryService = require('./inventories.service');
const asyncHandler = require('express-async-handler');

// Tạo đơn hàng
const addOrder = asyncHandler(async(data) => {
    return await Order.create(data);
});
// Cập nhật trạng thái đơn hàng
const updateOrder = asyncHandler(async(id, status) => {
    const order = await findOrderById(id);
    if(!order) throw new Error('Không tìm thấy thông tin đơn hàng');
    // Kiểm tra tra trạng trái
    // Nếu hủy đơn => hoàn trả lại số lượng trong kho
    if(status === 'Cancelled'){
        for(const product of order.products){
            await InventoryService.updateProductQuantityInventory({id: product.pid, quantity: product.quantity, operation: 'add'})
        }
    }
    return await Order.findByIdAndUpdate(id, {status: status}, {new: true});
});
// Tìm đơn hàng theo id
const findOrderById = asyncHandler(async(id) => {
    return await Order.findById({_id: id});
});
// Tìm tất cả các đơn hàng
const findAllOrder = asyncHandler(async() => {
    return await Order.find();
});
// Xóa đơn hàng
const deleteOrder = asyncHandler(async(id) => {
    return await Order.findByIdAndDelete({_id: id});
});

module.exports = {
    addOrder,
    updateOrder,
    findAllOrder,
    findOrderById,
    deleteOrder
}
