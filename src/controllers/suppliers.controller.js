const SupplierService = require('../services/suppliers.service');
const asyncHandler = require('express-async-handler');
// Thêm nhà cung cấp
const addSupplier = asyncHandler(async(req, res) => {
    const response = await SupplierService.addSupplier(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm nhà cung cấp thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm nhà cung cấp thành công'
    });
});
// Cập nhật nhà cung cấp
const updateSupplier = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await SupplierService.updateSupplier(sid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật nhà cung cấp thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật nhà cung cấp thành công'
    });
});
// Tìm nhà cung cấp theo id
const findSupplierById = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await SupplierService.findSupplierById(sid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy nhà cung cấp'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các nhà cung cấp
const findAllSupplier = asyncHandler(async(req, res) => {
    const response = await SupplierService.findAllSupplier();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy nhà cung cấp'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa nhà cung cấp
const deleteSupplier = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await SupplierService.deleteSupplier(sid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa nhà cung cấp thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa nhà cung cấp thành công'
    });
});
// Xóa nhiều thông tin
const deleteSuppliers = asyncHandler(async(req, res) => {
    const {suppliersId} = req.body;
    const response = await SupplierService.deleteSuppliers(suppliersId);
    if(!response){
        return res.status(400).json({
            success: false,
            message: "Xóa thông tin thất bại"
        })
    }
    return res.status(200).json({
        success: true,
        message: "Xóa thông tin thành công"
    })
})
module.exports = {
    addSupplier,
    updateSupplier,
    findSupplierById,
    findAllSupplier,
    deleteSupplier,
    deleteSuppliers
}

