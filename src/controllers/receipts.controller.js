const ReceiptService = require('../services/receipts.service');
const asyncHandler = require('express-async-handler');


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
    console.log(req.body);
    if (!req.body) throw new Error('Thiếu thông tin phiếu xuất');
    const response = await ReceiptService.removeReceipt(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xuất kho thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Tạo phiếu xuất kho thành công. Vui lòng chờ xét duyệt từ quản lý'
    })
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
    const response = await ReceiptService.updateProductReceipt(rid, pid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật sản phẩm trong phiệu nhập không thành công'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật sản phẩm trong phiệu nhập thành công'
    })
});
// Cập nhật thông tin nguyên liệu trong phiếu
const updateMaterialReceipt = asyncHandler(async(req, res) => {
    const {rid, mid} = req.params;
    const response = await ReceiptService.updateMaterialReceipt(rid, mid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật nguyên liệu trong phiệu nhập không thành công'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật nguyên liệu trong phiệu nhập thành công'
    })
});
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
            data: 'Không tim thấy thông tin phiếu'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
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
// Xóa thông tin nguyên liệu trong phiếu 
const deleteMaterialReceipt = asyncHandler(async(req, res) => {
    const {rid, mid} = req.params;
    const response = await ReceiptService.deleteMaterialReceipt(rid, mid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa nguyên liệu trong phiếu thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa nguyên liệu trong phiếu thành công'
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
// Xóa phiếu
const deleteReceipts = asyncHandler(async(req, res) => {
    const {receiptsId} = req.body;
    const response = await ReceiptService.deleteReceipts(receiptsId);
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
    deleteReceipt,
    updateMaterialReceipt,
    deleteMaterialReceipt,
    deleteReceipts
}