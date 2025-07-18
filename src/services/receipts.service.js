const Receipt = require('../models/receipt.model');
const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler')
// Tạo phiếu xuất nhập
const addReceipt = asyncHandler(async(data)=> {
    return await Receipt.create(data);
});
const removeReceipt = asyncHandler(async(data) => {
    const products = data.products || [];
    const materials = data.materials || [];
    if(products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            // Kiểm tra nếu sản phẩm không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Sản phẩm ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 sản phẩm để tạo đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Sản phẩm ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} sản phẩm`);
            }
        }
    }
    if(materials.length > 0) {
        for(let i = 0; i < materials.length; i++){
            const item = materials[i];
            const existingProduct = await Inventory.findOne({ materialId: item.mid });
            // Kiểm tra nếu nguyên liệu không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Nguyên liệu ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`nguyên liệu ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 nguyên liệu để tạo đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Nguyên liệu ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} nguyên liệu`);
            }
        }
    }
    return await Receipt.create(data);
})
// Cập nhật thông tin phiếu 
const updateReceipt = asyncHandler(async(rid, data) => {
    const receipt = Receipt.findById(rid);
    const products = data.products || [];
    const materials = data.materials || [];
    if(receipt?.typeReceipt === 'export' && products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            // Kiểm tra nếu sản phẩm không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Sản phẩm ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 sản phẩm để cập nhật đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Sản phẩm ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} sản phẩm`);
            }
            if(data.status === 'confirmed'){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.staff,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Xuất hàng mới từ phiếu ${id}`
                }
                await Inventory.findOneAndUpdate(
                    { productId: item.pid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.staff 
                        }
                    },
                    { new: true }
                );
                await Product.findByIdAndUpdate(
                    item.pid,
                    {$inc: {sold: item.quantity}}
                )
            }
        }
    }
    if(receipt?.typeReceipt === 'export' && materials.length > 0) {
        for(let i = 0; i < materials.length; i++){
            const item = materials[i];
            const existingProduct = await Inventory.findOne({ materialId: item.mid });
            // Kiểm tra nếu nguyên liệu không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Nguyên liệu ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Nguyên liệu ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 nguyên liệu để cập nhật đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Nguyên liệu ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} nguyên liệu`);
            }
            if(data.status === 'confirmed'){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.staff,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Xuất hàng mới từ phiếu ${id}`
                }
                await Inventory.findOneAndUpdate(
                    {materialId: item.mid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.staff 
                        }
                    },
                    { new: true }
                );
            }
        }
    }
    return await Receipt.findByIdAndUpdate(rid, data, {new: true});
});
// Cập nhật trạng thái phiếu
const updateStatusReceipt = asyncHandler(async(rid, status, approvedBy) => {
    const receipt = Receipt.findById(rid);
    const products = receipt.products || [];
    const materials = receipt.materials || [];
    if(receipt?.typeReceipt === 'export' && products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            // Kiểm tra nếu sản phẩm không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Sản phẩm ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 sản phẩm để cập nhật đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Sản phẩm ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} sản phẩm`);
            }
            if(data.status === 'confirmed'){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.staff,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Xuất hàng mới từ phiếu ${id}`
                }
                await Inventory.findOneAndUpdate(
                    { productId: item.pid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.staff 
                        }
                    },
                    { new: true }
                );
                await Product.findByIdAndUpdate(
                    item.pid,
                    {$inc: {sold: item.quantity}}
                )
            }
        }
    }
    if(receipt?.typeReceipt === 'export' && materials.length > 0) {
        for(let i = 0; i < materials.length; i++){
            const item = materials[i];
            const existingProduct = await Inventory.findOne({ materialId: item.mid });
            // Kiểm tra nếu nguyên liệu không tồn tại trong kho
            if(!existingProduct){
                throw new Error(`Nguyên liệu ${item.name} không tồn tại trong kho`);
            }
            // Kiểm tra số lượng tồn kho phải lớn hơn 50 
            if(existingProduct.currentStock <= 100){
                throw new Error(`Nguyên liệu ${item.name} có số lượng tồn kho (${existingProduct.currentStock}) không đủ. Cần tối thiểu 101 nguyên liệu để cập nhật đơn hàng`);
            }
            // Kiểm tra số lượng đặt hàng không được vượt quá tồn kho
            if(existingProduct.currentStock < item.quantity){
                throw new Error(`Nguyên liệu ${item.name} chỉ còn ${existingProduct.currentStock} trong kho, không thể đặt ${item.quantity} nguyên liệu`);
            }
            if(data.status === 'confirmed'){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.staff,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Xuất hàng mới từ phiếu ${id}`
                }
                await Inventory.findOneAndUpdate(
                    {materialId: item.mid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.staff 
                        }
                    },
                    { new: true }
                );
            }
        }
    }
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
    updateStatusReceipt,
    removeReceipt
}