const OrderService = require('../services/orders.service');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
let querystring = require('qs');
const moment = require('moment');
const config = require('../config/config');

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    
    keys.forEach(key => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    
    return sorted;
}
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
});
// Tạo thanh toán với vnpay
const createVnPayOrder = asyncHandler(async(req, res) => {
    if (req.timedout || req.headers['x-timeout'] || req.headers['x-gateway-error']) {
        return res.redirect(`${process.env.URL_CLIENT}`);
    }
    if(!req.body){
        throw new Error('Thông tin đơn hàng không hợp lệ')
    }
    const response = await OrderService.addOrderVnPay(req.body);
    if (!response) {
        return res.status(400).json({
            success: false,
            message: 'Tạo đơn hàng không thành công'
        });
    }
    process.env.TZ = 'Asia/Tra_Vinh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for']?.split(',').shift() || req.connection.remoteAddress || '127.0.0.1';
    
    let tmnCode = config.vnp_TmnCode.code;
    let secretKey = config.vnp_HashSecret.secret;
    let vnpUrl = config.vnp_Url.url;
    let returnUrl = config.vnp_Url_Return.url;
    let orderId =  moment(date).format('DDHHmmss');
    let bankCode = '';
    
    let locale = 'vn';
    let currCode = 'VND';
    let vnp_Params = {};
    
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = response._id.toString();
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = req.body.total * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    if (!vnpUrl) {
        await OrderService.deleteOrder(orderId);
        throw new Error('Tạo URL thanh toán không thành công');
    }
    return res.status(200).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        orderId: orderId,
        paymentUrl: vnpUrl
    });
    
});

// Trả về kết quả thanh toán với vnpay
const vnReturn = asyncHandler(async(req, res) => {
    let vnp_Params = { ...req.query };
    
    let secureHash = vnp_Params['vnp_SecureHash'];
    let id = vnp_Params['vnp_OrderInfo'];
    let responseCode = vnp_Params['vnp_ResponseCode'];
    
    if (!vnp_Params || Object.keys(vnp_Params).length === 0 || !secureHash) {
        await OrderService.deleteOrder(id);
        return res.redirect(`${process.env.URL_CLIENT}/checkout/return-order-vnp/97`);
    }
    if (responseCode === '24') {
        await OrderService.deleteOrder(id);
        return res.redirect(`${process.env.URL_CLIENT}/checkout/return-order-vnp/97`);
    }
    
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    
    vnp_Params = sortObject(vnp_Params);
    
    let tmnCode = config.vnp_TmnCode.code;
    let secretKey = config.vnp_HashSecret.secret;
    
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    if(secureHash === signed){
        if(responseCode === '00') {
            await OrderService.updateOrderVnPay(id);
            return res.redirect(`${process.env.URL_CLIENT}/checkout/return-order-vnp/${responseCode}`);
        } else {
            await OrderService.deleteOrder(id);
            return res.redirect(`${process.env.URL_CLIENT}/checkout/return-order-vnp/${responseCode}`);
        }
    } else {
        await OrderService.deleteOrder(id);
        return res.redirect(`${process.env.URL_CLIENT}/checkout/return-order-vnp/97`);
    }
});
// Cập nhật trạng thái đơn hàng
const updateOrder = asyncHandler(async(req, res) => {
    const {oid} = req.params;
    const response = await OrderService.updateOrder(oid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật đơn hàng không thành công'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật đơn hàng thành công'
    })
});
// Cập nhật trạng thái đơn hàng
const updateStatusOrderByAdmin = asyncHandler(async(req, res) => {
    const {oid} = req.params;
    const response = await OrderService.updateStatusOrderByAdmin(oid, req.body);
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
const updateStatusOrderByUser = asyncHandler(async(req, res) => {
    const {oid} = req.params;
    console.log(req.body);
    const response = await OrderService.updateStatusOrderByUser(oid, req.body.status);
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
// Xóa thông tin nhiều đơn hàng
const deleteOrders = asyncHandler(async(req, res) => {
    const {ordersId} = req.body;
    const response = await OrderService.deleteOrder(ordersId);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa thông tin đơn hàng thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa thông tin đơn hàng thành công'
    })
})
module.exports = {
    addOrder,
    updateOrder,
    updateStatusOrderByAdmin,
    updateStatusOrderByUser,
    findOrderById,
    findAllOrder,
    deleteOrder,
    deleteProductOrder,
    updateProductOrder,
    createVnPayOrder,
    vnReturn,
    deleteOrders
}