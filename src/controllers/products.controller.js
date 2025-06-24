const ProductService = require('../services/products.service');
const asyncHandler = require('express-async-handler');
// Thêm sản phẩm
const addProduct = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin sản phẩm');
    const thumb = req.file ? req.file.path : null;
    if(thumb) req.body.thumb = {
        url: req.file.name,
        public_id: req.file.name
    }
    const response = await ProductService.addProduct(req.body);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Thêm sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: false,
            message: 'Thêm sản phẩm thành công'
    });
});
// Cập nhật sản phẩm
const updateProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    const thumb = req.file ? req.file.path : null;
    if(thumb) req.body.thumb = {
        url: req.file.path,
        public_id: req.file.name
    }
    const response = await ProductService.updateProduct(pid, req.body);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Cập nhật sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: false,
            message: 'Cập nhật sản phẩm thành công'
    });
});
// Tìm kiếm sản phẩm theo id
const findProductById = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    const response = await ProductService.findProductById(pid);
    if(!response) {
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin sản phẩm'
        })
    }
    return res.status(200).json({
            success: false,
            data: response
    });
});
// Tìm kiếm tất cả các sản phẩm
const findAllProduct = asyncHandler(async(req, res) => {
    const response = await ProductService.findAllProduct();
    if(!response) {
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy sản phẩm'
        })
    }
    return res.status(200).json({
            success: false,
            data: response
    });
});
// Tìm kiếm sản phẩm theo slug
const findProductBySlug = asyncHandler(async(req, res) => {
    const {slug} = req.params;
    const response = await ProductService.findProductBySlug(slug);
    if(!response) {
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin sản phẩm'
        })
    }
    return res.status(200).json({
            success: false,
            data: response
    });
});
// Xóa sản phẩm
const deleteProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    const response = await ProductService.deleteProduct(pid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa sản phẩm thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm thành công'
    });
})
module.exports = {
    addProduct,
    updateProduct,
    findProductById,
    findAllProduct,
    findProductBySlug,
    deleteProduct
}