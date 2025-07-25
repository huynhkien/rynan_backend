const Supplier = require('../models/supplier.model');
const asyncHandler = require('express-async-handler');
// thêm nhà cung cấp
const addSupplier = asyncHandler(async(data) => {
    return await Supplier.create(data);
})
// Cập nhật nhà cung cấp
const updateSupplier = asyncHandler(async(id, data) => {
    return await Supplier.findByIdAndUpdate(id, data, {new: true});
})
// Tìm nhà cung cấp theo id
const findSupplierById = asyncHandler(async(id) => {
    return await Supplier.findById({_id: id});
})
// Tìm tất cả các nhà cung cấp
const findAllSupplier = asyncHandler(async() => {
    return await Supplier.find();
})
// Xóa nhà cung cấp
const deleteSupplier = asyncHandler(async (id) => {
    return await Supplier.findByIdAndDelete(id);
});
// Xóa nhiều thông tin 
const deleteSuppliers = asyncHandler(async(suppliersId) => {
    if(sSuppliersId) throw new Error('Không tìm thấy thông tin về Id');
    return await Supplier.deleteMany({_id: { $in: suppliersId }})
})
module.exports = {
    addSupplier,
    updateSupplier,
    findSupplierById,
    findAllSupplier,
    deleteSupplier,
    deleteSuppliers
}