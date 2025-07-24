const Specification = require('../models/specification.model');
const asyncHandler = require('express-async-handler');
// thêm quy cách đóng gói
const addSpecification = asyncHandler(async(data) => {
    return await Specification.create(data);
})
// Cập nhật quy cách đóng gói
const updateSpecification = asyncHandler(async(id, data) => {
    return await Specification.findByIdAndUpdate(id, data, {new: true});
})
// Tìm quy cách đóng gói theo id
const findSpecificationById = asyncHandler(async(id) => {
    return await Specification.findById({_id: id});
})
// Tìm tất cả các quy cách đóng gói
const findAllSpecification = asyncHandler(async() => {
    return await Specification.find();
})
// Xóa quy cách đóng gói
const deleteSpecification = asyncHandler(async (id) => {
    return await Specification.findByIdAndDelete(id);
});
// Xóa nhiều quy cách 
const deleteSpecifications = asyncHandler(async(specificationsId) => {
    if(!specificationsId) throw new Error('Không tìm thấy thông tin về Id');
    return await Specification.deleteMany({_id: { $in: specificationsId }})
})
module.exports = {
    addSpecification,
    updateSpecification,
    findSpecificationById,
    findAllSpecification,
    deleteSpecification,
    deleteSpecifications
}