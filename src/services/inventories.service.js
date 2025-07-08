const Inventory = require('../models/inventory.model');
const ReceiptService = require('../services/receipts.service');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm vào kho
const addInventory = asyncHandler(async(data) => {
    const responses = [];
    
    // Kiểm tra dữ liệu đầu vào
    if(!data.rid || !data.approvedBy || !data.status){
        throw new Error('Vui lòng nhập đầy đủ các thông tin');
    }
    
    // Kiểm tra an toàn cho products và materials
    const products = data.products || [];
    const materials = data.materials || [];
    
    if(!products.length && !materials.length){
        throw new Error('Không có thông tin về nguyên liệu hoặc sản phẩm');
    }
    if(data.status === 'cancelled') {
        // Chỉ cập nhật trạng thái phiếu thành cancelled
        await ReceiptService.updateStatusReceipt(data.rid, data.status, data.approvedBy);
        throw new Error('Bạn đã hủy phiếu xét duyệt nhập kho');
    }
    // Cập nhật trạng thái phiếu khi đã duyệt
    await ReceiptService.updateStatusReceipt(data.rid, data.status, data.approvedBy);

    // Xử lý products
    if(products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });

            if(existingProduct){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock + newQuantity;
                const newApproval = {
                    approvedBy: data.approvedBy,
                    approvedAt: new Date(),
                    action: 'updated',
                    quantityChange: newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Cập nhật từ phiếu ${data.rid}`
                };

                const updated = await Inventory.findOneAndUpdate(
                    { productId: item.pid },
                    {
                        $inc: { currentStock: newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            location: item.location, 
                            approvedBy: data.approvedBy 
                        }
                    },
                    { new: true }
                );

                responses.push(updated);
            } else {
                const newStock = item.quantity || 0;
                const newApproval = {
                    approvedBy: data.approvedBy,
                    approvedAt: new Date(),
                    action: 'created',
                    quantityChange: newStock,
                    previousStock: 0,
                    newStock,
                    notes: item.notes || `Tạo mới từ phiếu ${data.rid}`
                };

                const newInventory = await Inventory.create({
                    productId: item.pid,
                    currentStock: newStock,
                    approvedBy: data.approvedBy,
                    approvalHistory: [newApproval],
                    type: 'product',
                    location: item.location,
                    lastUpdated: new Date(),
                });

                responses.push(newInventory);
            }
        }
    }
    
    // Xử lý materials
    if(materials.length > 0) {
        for(let i = 0; i < materials.length; i++){
            const item = materials[i];
            const existingMaterial = await Inventory.findOne({ materialId: item.mid });

            if(existingMaterial){
                const previousStock = existingMaterial.currentStock;
                const newQuantity = item.quantity || 0;
                const newStock = previousStock + newQuantity;
                const newApproval = {
                    approvedBy: data.approvedBy,
                    approvedAt: new Date(),
                    action: 'updated',
                    quantityChange: newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Cập nhật từ phiếu ${data.rid}`
                };

                const updated = await Inventory.findOneAndUpdate(
                    { materialId: item.mid }, // Sửa lỗi: đổi từ item.pid thành item.mid
                    {
                        $inc: { currentStock: newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            location: item.location, 
                            approvedBy: data.approvedBy 
                        }
                    },
                    { new: true }
                );

                responses.push(updated);
            } else {
                const newStock = item.quantity || 0;
                const newApproval = {
                    approvedBy: data.approvedBy,
                    approvedAt: new Date(),
                    action: 'created',
                    quantityChange: newStock,
                    previousStock: 0,
                    newStock,
                    notes: item.notes || `Tạo mới từ phiếu ${data.rid}`
                };

                const newInventory = await Inventory.create({
                    materialId: item.mid, 
                    currentStock: newStock,
                    approvedBy: data.approvedBy,
                    approvalHistory: [newApproval],
                    type: 'material',
                    location: item.location,
                    lastUpdated: new Date(),
                });

                responses.push(newInventory);
            }
        }
    }

    return responses;
});
// xuất kho
const removeInventory = asyncHandler(async(data) => {
    const responses = [];
    // Kiểm tra dữ liệu đầu vào
    if(!data.rid || !data.approvedBy || !data.status){
        throw new Error('Vui lòng nhập đầy đủ các thông tin');
    }
    // Kiểm tra an toàn cho products và materials
    const products = data.products || [];
    const materials = data.materials || [];
    if(!products.length && !materials.length){
        throw new Error('Không có thông tin về nguyên liệu hoặc sản phẩm');
    }
    if(data.status === 'cancelled') {
        // Chỉ cập nhật trạng thái phiếu thành cancelled
        await ReceiptService.updateStatusReceipt(data.rid, data.status, data.approvedBy);
        throw new Error('Bạn đã hủy phiếu xét duyệt xuất kho');
    }
    // Cập nhật trạng thái phiếu
    await ReceiptService.updateStatusReceipt(data.rid, data.status, data.approvedBy);
    // Xử lý products
    if(products.length > 0) {
        for(let i = 0; i < products.length; i++){
            const item = products[i];
            const existingProduct = await Inventory.findOne({ productId: item.pid });
            if(existingProduct){
                const previousStock = existingProduct.currentStock;
                const newQuantity = item.quantity || 0;
                // Kiểm tra số lượng tồn kho
                if(previousStock < newQuantity && previousStock < 50) {
                    throw new Error(`Không đủ số lượng tồn kho cho sản phẩm ${item.pid}. Tồn kho hiện tại: ${previousStock}, yêu cầu xuất: ${newQuantity}`);
                }
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.approvedBy,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity,
                    previousStock,
                    newStock,
                    notes: item.notes || `Xuất kho từ phiếu ${data.rid}`
                };

                const updated = await Inventory.findOneAndUpdate(
                    { productId: item.pid },
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.approvedBy 
                        }
                    },
                    { new: true }
                );
                responses.push(updated);
            } else {
                throw new Error('Sản phẩm không tồn tại trong kho. Vui lòng chọn thêm sản phẩm vào kho để tiến hành xuất kho.')
            }
        }
    }
    // Xử lý materials
    if(materials.length > 0) {
        for(let i = 0; i < materials.length; i++){
            const item = materials[i];
            const existingMaterial = await Inventory.findOne({ materialId: item.mid });

            if(existingMaterial){
                const previousStock = existingMaterial.currentStock;
                const newQuantity = item.quantity || 0;
                // Kiểm tra số lượng tồn kho
                if(previousStock < newQuantity && previousStock < 50) {
                    throw new Error(`Không đủ số lượng tồn kho cho nguyên liệu ${item.mid}. Tồn kho hiện tại: ${previousStock}, yêu cầu xuất: ${newQuantity}`);
                }
                
                const newStock = previousStock - newQuantity; 
                const newApproval = {
                    approvedBy: data.approvedBy,
                    approvedAt: new Date(),
                    action: 'removed',
                    quantityChange: -newQuantity, 
                    previousStock,
                    newStock,
                    notes: item.notes || `Xuất kho từ phiếu ${data.rid}`
                };

                const updated = await Inventory.findOneAndUpdate(
                    { materialId: item.mid }, 
                    {
                        $inc: { currentStock: -newQuantity },
                        $push: { approvalHistory: newApproval },
                        $set: { 
                            lastUpdated: new Date(), 
                            approvedBy: data.approvedBy 
                        }
                    },
                    { new: true }
                );

                responses.push(updated);
            } else {
                throw new Error('Nguyên liệu không tồn tại trong kho. Vui lòng chọn thêm nguyên liệu vào kho để tiến hành xuất kho.')
            }
        }
    }

    return responses;
});
// Truy xuất sản phẩm trong kho
const findAllInventory = asyncHandler(async() => {
    return await Inventory.find();
});
module.exports = {
    addInventory,
    removeInventory,
    findAllInventory,
}