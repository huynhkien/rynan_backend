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
    return await Order.findById(id);
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
    order.products.splice(productIndex, 1);
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
