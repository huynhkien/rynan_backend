const Order = require('../models/order.model');
const ProductService = require('./products.service');
const InventoryService = require('./inventories.service');
const asyncHandler = require('express-async-handler');

// Tạo đơn hàng
const addOrder = asyncHandler(async(data) => {
    return await Order.create(data);
});
// Tìm đơn hàng theo id
const findOrderById = asyncHandler(async(id) => {
    return await Order.findById(id);
});
// Cập nhật trạng thái đơn hàng
const updateOrder = asyncHandler(async(id, data) => {
    return await Order.findByIdAndUpdate(id, data, {new: true});
});
// Tìm tất cả các đơn hàng
const findAllOrder = asyncHandler(async() => {
    return await Order.find();
});
// Xóa đơn hàng
const deleteOrder = asyncHandler(async(id) => {
    return await Order.findByIdAndDelete({_id: id});
});
// Xóa sản phẩm trong đơn hàng
const deleteProductOrder = asyncHandler(async (oid, pid) => {
    const order = await Order.findById(oid);
    const productOrderIndex = order?.products?.findIndex((el) => el.pid.toString() === pid);
    if (productOrderIndex === -1) {
      throw new Error('Không tìm thấy sản phẩm trong đơn hàng');
    }
    // Xóa
    order.products.splice(productOrderIndex, 1);
    // Cập nhật lại tổng giá
    order.total = order?.products?.reduce((sum, item) => sum + (item?.price * item?.quantity || 0), 0)

    return await order.save();
});
// Cập nhật sản phẩm trong đơn hàng
const updateProductOrder = asyncHandler(async (oid, pid, data) => {
    const order = await Order.findById(oid);
    const productOrderIndex = order?.products?.findIndex((el) => el.pid.toString() === pid);
    if (productOrderIndex === -1) {
      throw new Error('Không tìm thấy sản phẩm trong đơn hàng');
    }
    // Cập nhật
    const updateProduct = {
        ...order.products[productOrderIndex].toObject(),
        ...data
    }
    order.products[productOrderIndex] = updateProduct
    // Cập nhật lại tổng giá
    order.total = order?.products?.reduce((sum, item) => sum + (item?.price * item?.quantity || 0), 0)

    return await order.save();
});


module.exports = {
    addOrder,
    updateOrder,
    findAllOrder,
    findOrderById,
    deleteOrder,
    deleteProductOrder,
    updateProductOrder
}
