const ReceiptService = require('../services/receipts.service');
const InventoryService = require('../services/inventories.service');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');


// Tạo phiếu nhập
const addImportReceipt = asyncHandler(async (req, res) => {
    if (!req.body) throw new Error('Thiếu thông tin phiếu nhập');
    const response = await ReceiptService.addReceipt(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Nhập kho thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Tạo phiếu nhập kho thành công. Vui lòng chờ xét duyệt từ quản lý'
    })
});

// Tạo phiếu xuất hàng
const addExportReceipt = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin phiếu xuất');
    const session = await mongoose.startSession();
    try{
        await session.withTransaction(async () => {
            for(const product of req.body.products) {
                // Kiểm tra sản phẩm có tồn tại trong kho hay không
                const productInventory = InventoryService.findProductInventory(product.pid, session);
                // Nếu không => báo lỗi => ngưng
                if(!productInventory) {
                   throw new Error(`Sản phẩm ${product.name} hiện không có trong kho`);
                // Nếu số lượng sản phẩm trong phiếu xuất lớn hơn số lượng sản phẩm trong kho => báo lỗi => ngưng
                }else if(product.quantity >= productInventory.quantity){
                    throw new Error(`Sản phẩm ${product.name} hiện số lượng không có đủ trong kho`);
                }
                await InventoryService.updateProductQuantityInventory({ id: product.pid, quantity: product.quantity, operation: 'minus' }, session);
            }
            // Tạo phiếu xuất
            const response = await ReceiptService.addReceipt(req.body);
            if(!response){
                return res.status(400).json({
                    success: false,
                    message: 'Tạo phiếu xuất thành công'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Tạo phiếu xuất thành công'
            });
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: `Lỗi ${error.message}`
        });
    }finally{
        // Kết thúc session
        await session.endSession();
    }
});
// Cập nhật thông tin phiếu
const updateReceipt = asyncHandler(async(req, res) => {
    const {rid} = req.params;
    const response = await ReceiptService.updateReceipt(rid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật thông tin phiếu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin phiếu thành công'
    });
});
// Cập nhật thông tin sản phẩm trong phiếu
const updateProductReceipt = asyncHandler(async(req, res) => {
    const {rid, pid} = req.params;
    // Khởi tạo session
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async() => {
            // Tìm kiếm sản phẩm tồn tại trong kho
            const productInventory = await InventoryService.findProductInventory(pid, session);
            // Nếu không => trả về lỗi
            if(!productInventory) throw new Error('Không tìm thấy sản phẩm trong kho');
            // Tìm kiếm thông tin phiếu
            const receipt = await ReceiptService.findReceiptById(rid);
            // Tìm kiếm số lượng sản phẩm trước khi thay đổi
            const productReceiptIndex = receipt.products.findIndex(el => el.pid.toString() === pid);
            // Số lượng sản phẩm trước khi thay đổi
            const quantityOld = receipt.products[productReceiptIndex].quantity || 0;
            // Tính toán thay đổi số lượng
            const quantityDifference = req.body.quantity - quantityOld;
            if(receipt.typeReceipt === 'import') {
                await InventoryService.updateProductQuantityInventory({ id: pid, quantity: quantityDifference, operation: 'add' }, session);
            }else if(receipt.typeReceipt === 'export'){
                await InventoryService.updateProductQuantityInventory({ id: pid, quantity: quantityDifference, operation: 'minus' }, session);
            }else{
                throw new Error('Không tìm thấy thông tin phiếu')
            }
            const response = await ReceiptService.updateProductReceipt(rid, pid, req.body);
                if(!response){
                    return res.status(400).json({
                        success: false,
                        message: 'Cập nhật thông tin sản phẩm trong phiếu thất bại'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Cập nhật thông tin sản phẩm trong phiếu thành công'
                });
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message: `Lỗi ${error.message}`
        });
    }finally{
        await session.endSession();
    }
    
})
// Tìm thông tin phiếu theo id
const findReceiptById = asyncHandler(async(req, res) => {
    const {rid} = req.params;
    const response = await ReceiptService.findReceiptById(rid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin phiếu'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các phiếu
const findAllReceipt = asyncHandler(async(req, res) => {
    const response = await ReceiptService.findAllReceipt();
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Không tim thấy thông tin phiếu'
        });
    }
    return res.status(200).json({
        success: true,
        message: response
    });
});
// Xóa thông tin sản phẩm trong phiếu 
const deleteProductReceipt = asyncHandler(async(req, res) => {
    const {rid, pid} = req.params;
    const response = await ReceiptService.deleteProductReceipt(rid, pid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa sản phẩm trong phiếu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm trong phiếu thành công'
    });
});
// Xóa phiếu
const deleteReceipt = asyncHandler(async(req, res) => {
    const {rid} = req.params;
    const response = await ReceiptService.deleteReceipt(rid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa phiếu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa phiếu thành công'
    })
})
module.exports = {
    addImportReceipt,
    addExportReceipt,
    findReceiptById,
    findAllReceipt,
    updateReceipt,
    updateProductReceipt,
    deleteProductReceipt,
    deleteReceipt
}