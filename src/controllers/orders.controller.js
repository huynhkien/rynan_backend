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
})
module.exports = {
    addOrder,
    updateOrder
}