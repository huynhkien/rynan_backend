const InventoryService = require('../services/inventories.service');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm vào kho
const addInventory = asyncHandler(async(req, res) => {
    const response = await InventoryService.addInventory(req.body);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Lỗi khi thực hiện quá trình nhập kho'
        });
    }
    return res.status(200).json({
            success: true,
            message: 'Nhập kho thành công'
        });
});
// Xuất kho
const removeInventory = asyncHandler(async(req, res) => {
    const response = await InventoryService.removeInventory(req.body);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Lỗi khi thực hiện quá trình xuất kho'
        });
    }
    return res.status(200).json({
            success: true,
            message: 'Xuất kho thành công'
        });
})
// Lấy tất cả các thông tin 
const findAllInventory = asyncHandler(async(req, res) => {
    const response = await InventoryService.findAllInventory();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});

module.exports = {
    findAllInventory,
    addInventory,
    removeInventory
}