const { default: mongoose } = require('mongoose');
const Warehouse = require('../models/warehouse.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm trong kho
const addWarehouse = asyncHandler(async(data) => {
    await Warehouse.create(data);
});

// Cập nhật sản phẩm trong kho
const updateWarehouse = asyncHandler(async(id, data) => {
    await Warehouse.findByIdAndUpdate(id, data, {new: true});
});
// Tìm thông tin theo id của warehouse
const findWarehouseById = asyncHandler(async(id) => {
    await Warehouse.findById({_id: id});
});
// Tìm thông tin của products trong warehouse
const findQuantityProductWarehouse = asyncHandler(async(id) => {
    await Warehouse.aggregate([
        {$match: {type: 'Phiếu nhập'} },
        {$unwind: '$products'},
        {$match: {
            'products.pid': id
        }},
        {$group: {
            _id: null,
            total:{ $sum: '$products.quantity'}
        }}
    ]);
})
// Tìm tất cả thông tin
const findAllWarehouse = asyncHandler(async() => {
    await Warehouse.find();
});
// Xóa thông tin
const deleteWarehouse = asyncHandler(async(id) => {
    await Warehouse.findByIdAndDelete({_id: id});
});

module.exports = {
    addWarehouse,
    updateWarehouse,
    findWarehouseById,
    findAllWarehouse,
    deleteWarehouse,
    findQuantityProductWarehouse
}