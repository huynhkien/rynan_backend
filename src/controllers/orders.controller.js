const OrderService = require('../services/orders.service');
const asyncHandler = require('express-async-handler');

// Thêm đơn hàng
const addOrder = asyncHandler(async(req, res) => {
    const response = await OrderService.addOrder(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm đơn hàng không thành công'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm đơn hàng thành công'
    });
})
// Cập nhật trạng thái đơn hàng
const updateOrder = asyncHandler(async(req, res) => {
    const {oid} = req.params;
    const response = await OrderService.updateOrder(oid, req.body.status);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật trạng thái đơn hàng không thành công'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công'
    })
});
// Cập nhật trạng thái đơn hàng
const updateProductOrder = asyncHandler(async(req, res) => {
    const {oid, pid} = req.params;
    const response = await OrderService.updateProductOrder(oid, pid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật sản phẩm trong đơn hàng không thành công'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật sản phẩm trong đơn hàng thành công'
    })
});
// Tìm đơn hàng theo id 
const findOrderById = asyncHandler(async(req, res) => {
    const {oid} = req.params;
    const response = await OrderService.findOrderById(oid);
    if(!response) {
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy đơn hàng'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các đơn hàng
const findAllOrder = asyncHandler(async(req, res) => {
    const response = await OrderService.findAllOrder();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin đơn hàng'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa thông tin đơn hàng
const deleteOrder = asyncHandler(async(req, res) => {
    const {oid} = req.params;
    const response = await OrderService.deleteOrder(oid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa đơn hàng thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa thông tin đơn hàng thành công'
    })
})
// Xóa thông tin sản phẩm trong đơn hàng
const deleteProductOrder = asyncHandler(async(req, res) => {
    const {oid, pid} = req.params;
    const response = await OrderService.deleteProductOrder(oid, pid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa sản phẩm trong đơn hàng thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm trong đơn hàng thành công'
    })
})
module.exports = {
    addOrder,
    updateOrder,
    findOrderById,
    findAllOrder,
    deleteOrder,
    deleteProductOrder,
    updateProductOrder
}