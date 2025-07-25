const Material = require('../models/material.model');
const asyncHandler = require('express-async-handler');
// thêm nhà nguyên liệu
const addMaterial = asyncHandler(async(data) => {
    return await Material.create(data);
})
// Cập nhật nhà nguyên liệu
const updateMaterial = asyncHandler(async(id, data) => {
    return await Material.findByIdAndUpdate(id, data, {new: true});
})
// Tìm nhà nguyên liệu theo id
const findMaterialById = asyncHandler(async(id) => {
    return await Material.findById({_id: id});
})
// Tìm tất cả các nhà nguyên liệu
const findAllMaterial = asyncHandler(async() => {
    return await Material.find();
})
// Xóa nhà nguyên liệu
const deleteMaterial = asyncHandler(async (id) => {
    return await Material.findByIdAndDelete(id);
});
// Xóa nhiều thông tin 
const deleteMaterials = asyncHandler(async(materialsId) => {
    if(!materialsId) throw new Error('Không tìm thấy thông tin về Id');
    return await Material.deleteMany({_id: { $in: materialsId }})
})
module.exports = {
    addMaterial,
    updateMaterial,
    findMaterialById,
    findAllMaterial,
    deleteMaterial,
    deleteMaterials
}