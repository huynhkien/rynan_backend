const Receipt = require('../models/receipt.model');
const asyncHandler = require('express-async-handler')
// Tạo phiếu xuất nhập
const addReceipt = asyncHandler(async(data)=> {
    return await Receipt.create(data);
});
// Cập nhật thông tin phiếu 
const updateReceipt = asyncHandler(async(rid, data) => {
    return await Receipt.findByIdAndUpdate(rid, data, {new: true});
});
// Cập nhật trạng thái phiếu
const updateStatusReceipt = asyncHandler(async(rid, status, approvedBy) => {
    if(! rid  || !status | !approvedBy) throw new Error('Vui lòng điền đầy đủ các thông tin')
    return await Receipt.findByIdAndUpdate(rid, {status: status, approvedBy: approvedBy}, {new: true});
})
// Tìm thông tin phiếu theo id
const findReceiptById = asyncHandler(async(id) => {
    return await Receipt.findById({_id: id});
});
// Cập nhật thông tin sản phẩm trong phiếu
const updateProductReceipt = asyncHandler(async(rid, pid, data) => {
    const receipt = await Receipt.findById(rid);
    if(!receipt) throw new Error('Không tìm thấy thông tin phiếu');
    const productIndex = receipt.products.findIndex(item => item.pid.toString() === pid);
    if(productIndex === -1) throw new Error('Không tìm thấy sản phẩm trong phiếu');
    const updateData = {
        ...receipt.products[productIndex].toObject(),
        ...data
    }
    receipt.products[productIndex] = updateData;
    return receipt.save();
});

// Cập nhật thông tin nguyên liêu trong phiếu
const updateMaterialReceipt = asyncHandler(async(rid, mid, data) => {
    if(!rid) throw new Error('Không tìm thấy id');
    console.log(rid);
    const receipt = await Receipt.findById(rid);
    if(!receipt) throw new Error('Không tìm thấy');
    if (!receipt.materials.length < 0) {
    throw new Error('Không tìm thấy danh sách nguyên vật liệu trong phiếu');
    }
    const materialIndex = receipt?.materials.findIndex(item => item.mid.toString() === mid);
    if (materialIndex === -1) throw new Error('Không tìm thấy sản phẩm trong phiếu');
    const updateData = {
        ...receipt.materials[materialIndex].toObject(),
        ...data
    }
    receipt.materials[materialIndex] = updateData;
    receipt.total = receipt?.materials?.reduce((sum, item) => sum + (item?.price * item?.quantity || 0), 0)
    return receipt.save();
});

// Tìm thông tin tất cả các phiếu
const findAllReceipt = asyncHandler(async() => {
    return await Receipt.find();
});
// Xóa thông tin phiếu
const deleteReceipt = asyncHandler(async(id) => {
    return await Receipt.findByIdAndDelete({_id: id});
});
// Xóa thông tin sản phẩm trong phiếu
const deleteProductReceipt = asyncHandler(async(rid, pid) => {
    return await Receipt.findByIdAndUpdate(
        rid,
        {$pull: {products: {pid: pid}}},
        {new: true}
    )
})
// Xóa thông tin nguyên liêu trong phiếu
const deleteMaterialReceipt = asyncHandler(async(rid, mid) => {
    return await Receipt.findByIdAndUpdate(
        rid,
        {$pull: {materials: {mid: mid}}},
        {new: true}
    )
})
module.exports = {
    addReceipt,
    updateReceipt,
    updateProductReceipt,
    updateMaterialReceipt,
    findReceiptById,
    findAllReceipt,
    deleteReceipt,
    deleteProductReceipt,
    deleteMaterialReceipt,
    updateStatusReceipt
}