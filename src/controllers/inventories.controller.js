const InventoryService = require('../services/inventories.service');
const asyncHandler = require('express-async-handler');

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
    findAllInventory
}