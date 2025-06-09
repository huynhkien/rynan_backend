const WarehouseService = require('../services/warehouse.service');
const asyncHandler = require('express-async-handler');

// thêm sản phẩm vào kho
const addWarehouse = asyncHandler(async(req, res) => {
    if(req.body.type === 'export') {
        for(const product of req.body.products){
            const warehouse = await WarehouseService
        }
    }
})