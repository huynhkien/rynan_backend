const MaterialService = require('../services/materials.service');
const asyncHandler = require('express-async-handler');
// Thêm nguyên liệu
const addMaterial = asyncHandler(async(req, res) => {
    const response = await MaterialService.addMaterial(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm nguyên liệu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm nguyên liệu thành công'
    });
});
// Cập nhật nguyên liệu
const updateMaterial = asyncHandler(async(req, res) => {
    const {mid} = req.params;
    const response = await MaterialService.updateMaterial(mid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật nguyên liệu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật nguyên liệu thành công'
    });
});
// Tìm nguyên liệu theo id
const findMaterialById = asyncHandler(async(req, res) => {
    const {mid} = req.params;
    const response = await MaterialService.findMaterialById(mid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy nguyên liệu'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các nguyên liệu
const findAllMaterial = asyncHandler(async(req, res) => {
    const response = await MaterialService.findAllMaterial();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy nguyên liệu'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa nguyên liệu
const deleteMaterial = asyncHandler(async(req, res) => {
    const {mid} = req.params;
    const response = await MaterialService.deleteMaterial(mid);
    console.log(response)
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa nguyên liệu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa nguyên liệu thành công'
    });
});
module.exports = {
    addMaterial,
    updateMaterial,
    findMaterialById,
    findAllMaterial,
    deleteMaterial
}

