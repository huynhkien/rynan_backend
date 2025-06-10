const Receipt = require('../models/receipt.model');
const asyncHandler = require('express-async-handler')
// Tạo phiếu xuất nhập
const addReceipt = asyncHandler(async(data)=> {
    return await Receipt.create(data);
});
// Cập nhật thông tin phiếu 
const updateReceipt = asyncHandler(async(rid, data) => {
    const receipt = findReceiptById(rid);
    let updateData = {...data};
    if(!receipt) throw new Error('Không tìm thấy thông tin phiếu');
    if(receipt.typeReceipt === 'export' && data.typeReceipt === 'import'){
        updateData.exportedTo = null;
    }
    return await Receipt.findByIdAnUpdate(rid, updateData, {new: true});
});
// Cập nhật thông tin sản phẩm trong phiếu
const updateProductReceipt = asyncHandler(async({rid, pid, data}) => {
    const receipt = findReceiptById(rid);
    if(!receipt) throw new Error('Không tìm thấy thông tin phiếu');
    const productIndex = receipt.products.findIndex(item => item._id.toString() === pid);
    if(productIndex !== -1) throw new Error('Không tìm thấy sản phẩm trong phiếu');
    const updateData = {
        ...receipt.products[productIndex].toObject(),
        ...data
    }
    receipt.products[productIndex] = updateData;
    return receipt.save();
});
// Tìm thông tin phiếu theo id
const findReceiptById = asyncHandler(async(id) => {
    return await Receipt.findById({_id: id});
});
// Tìm thông tin tất cả các phiếu
const findAllReceipt = asyncHandler(async() => {
    return await Receipt.find();
});
// Xóa thông tin phiếu
const deleteReceipt = asyncHandler(async(id) => {
    return await Receipt.findByIdAnDelete({_id: id});
});
// Xóa thông tin sản phẩm trong phiếu
const deleteProductReceipt = asyncHandler(async(rid, pid) => {
    return await Receipt.findByIdAndUpdate(
        rid,
        {$pull: {products: {pid: pid}}},
        {new: true}
    )
})
module.exports = {
    addReceipt,
    updateReceipt,
    updateProductReceipt,
    findReceiptById,
    findAllReceipt,
    deleteReceipt,
    deleteProductReceipt
}