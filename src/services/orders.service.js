const Order = require('../models/order.model');
const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

// Tạo đơn hàng
const addOrder = asyncHandler(async(data) => {
    const products = data.products || [];
    if(products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            // Kiểm tra nếu sản phẩm không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Sản phẩm ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 sản phẩm để tạo đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Sản phẩm ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} sản phẩm`);
            }
        }
    }
    return await Order.create(data);
});
// Tìm đơn hàng theo id
const findOrderById = asyncHandler(async(id) => {
    return await Order.findById(id);
});
// Cập nhật đơn hàng
const updateOrder = asyncHandler(async(id, data) => {
    const products = data.products || [];
    if(products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            // Kiểm tra nếu sản phẩm không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Sản phẩm ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 sản phẩm để cập nhật đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Sản phẩm ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} sản phẩm`);
            }
            if(data.status === 'Received' || data.status === 'Succeed' || data.status === 'Delivering' ){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.staff,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Tạo đơn hàng mới ${id}`
                }
                await Inventory.findOneAndUpdate(
                    { productId: item.pid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.staff 
                        }
                    },
                    { new: true }
                );
                await Product.findByIdAndUpdate(
                    item.pid,
                    {$inc: {sold: item.quantity}}
                )
            }
        }
    }
    return await Order.findByIdAndUpdate(id, data, {new: true});
});
// Cập nhật trạng thái đơn hàng
const updateStatusOrderByAdmin = asyncHandler(async(id, data) => {
    const order = Order.findById(id);
    if(!order) throw new Error("Không tìm thấy thông tin đơn hàng");
    const products = order.products || [];
    if(products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            // Kiểm tra nếu sản phẩm không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Sản phẩm ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 sản phẩm để cập nhật đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Sản phẩm ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} sản phẩm`);
            }
            if(data.status === 'Received' || data.status === 'Succeed' || data.status === 'Delivering' ){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.staff,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Tạo đơn hàng mới ${id}`
                }
                await Inventory.findOneAndUpdate(
                    { productId: item.pid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.staff 
                        }
                    },
                    { new: true }
                );
                await Product.findByIdAndUpdate(
                    item.pid,
                    {$inc: {sold: item.quantity}}
                )
            }
        }
    }
    return await Order.findByIdAndUpdate(id, {status: data.status, location: data.location}, {new: true});
});
// Cập nhật trạng thái đơn hàng
const updateStatusOrderByUser = asyncHandler(async(id, status) => {
    console.log(status);
    return await Order.findByIdAndUpdate(
        id,
        {status: status},
        {new: true}
    )
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
    updateStatusOrderByUser,
    updateStatusOrderByAdmin,
    findAllOrder,
    findOrderById,
    deleteOrder,
    deleteProductOrder,
    updateProductOrder
}
