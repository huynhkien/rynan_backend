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

module.exports = {
    addOrder
}