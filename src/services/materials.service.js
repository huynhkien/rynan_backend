const Material = require('../models/material.model');
const asyncHandler = require('express-async-handler');
// thêm nhà cung cấp
const addMaterial = asyncHandler(async(data) => {
    return await Material.create(data);
})
// Cập nhật nhà cung cấp
const updateMaterial = asyncHandler(async(id, data) => {
    return await Material.findByIdAndUpdate(id, data, {new: true});
})
// Tìm nhà cung cấp theo id
const findMaterialById = asyncHandler(async(id) => {
    return await Material.findById({_id: id});
})
// Tìm tất cả các nhà cung cấp
const findAllMaterial = asyncHandler(async() => {
    return await Material.find();
})
// Xóa nhà cung cấp
const deleteMaterial = asyncHandler(async (id) => {
    return await Material.findByIdAndDelete(id);
});

module.exports = {
    addMaterial,
    updateMaterial,
    findMaterialById,
    findAllMaterial,
    deleteMaterial,
}