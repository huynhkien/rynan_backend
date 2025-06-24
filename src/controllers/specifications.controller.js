const SpecificationService = require('../services/specifications.service');
const asyncHandler = require('express-async-handler');
// Thêm quy cách đóng gói
const addSpecification = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin quy cách đóng gói');
    const response = await SpecificationService.addSpecification(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm quy cách đóng gói thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm quy cách đóng gói thành công'
    });
});
// Cập nhật quy cách đóng gói
const updateSpecification = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await SpecificationService.updateSpecification(sid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật quy cách đóng gói thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật quy cách đóng gói thành công'
    });
});
// Tìm quy cách đóng gói theo id
const findSpecificationById = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await SpecificationService.findSpecificationById(sid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy quy cách đóng gói'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các quy cách đóng gói
const findAllSpecification = asyncHandler(async(req, res) => {
    const response = await SpecificationService.findAllSpecification();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy quy cách đóng gói'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa quy cách đóng gói
const deleteSpecification = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await SpecificationService.deleteSpecification(sid);
    console.log(response)
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa quy cách đóng gói thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa quy cách đóng gói thành công'
    });
});
module.exports = {
    addSpecification,
    updateSpecification,
    findSpecificationById,
    findAllSpecification,
    deleteSpecification
}

