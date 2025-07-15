const ProductService = require('../services/products.service');
const asyncHandler = require('express-async-handler');
// Thêm sản phẩm
const addProduct = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin sản phẩm');
    if(req.body.tags){
        const tags = JSON.parse(req.body.tags);
        req.body.tags = tags;
    }
    const thumb = req.file ? req.file.path : null;
    if(thumb) req.body.thumb = {
        url: req.file.path,
        public_id: req.file.filename
    }
    const response = await ProductService.addProduct(req.body);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Thêm sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            data: response
    });
});
// Cập nhật sản phẩm
const updateProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    if(req.body.tags){
        const tags = JSON.parse(req.body.tags);
        req.body.tags = tags;
    }
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
            success: true,
            message: 'Cập nhật sản phẩm thành công'
    });
});
// Cập nhật bài viết sản phẩm
const updateDescriptionProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    console.log(pid)
    console.log(req.body.description);
    const response = await ProductService.updateDescriptionProduct(pid, req.body.description);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Thêm bài viết sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: true,
            message: 'Thêm bài viết sản phẩm thành công'
    });
});
// Thêm giá tiền cho sản phẩm
const addPriceProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    console.log(pid)
    const product = await ProductService.findProductById(pid);
    if(!req.body.prices) return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin priceType'
        });
    if(!product) throw new Error('Sản phẩm không tồn tại');
    const existingPrice = product.prices.find((existingPrice) => 
        existingPrice.priceType === req.body.prices.priceType
    );
    if (existingPrice) {
        return res.status(400).json({
            success: false,
            message: 'Tồn tại loại giá'
        });
    }

    const response = await ProductService.AddPriceProduct(pid, req.body.prices);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Thêm giá sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: true,
            message: 'Thêm giá sản phẩm thành công'
    });
});
// Cập nhật thông tin giá tiền cho sản phẩm
const updatePriceProduct = asyncHandler(async(req, res) => {
    const {pid, rid} = req.params;
    console.log(req.body)
    const response = await ProductService.updatePriceProduct({
        pid,
        rid,
        data: req.body
    });
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Cập nhật giá sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: true,
            message: 'Cập nhật giá sản phẩm thành công'
    });
})
// Xóa thông tin giá tiền cho sản phẩm
const deletePriceProduct = asyncHandler(async(req, res) => {
    const {pid, rid} = req.params;
    const response = await ProductService.deletePriceProduct(pid, rid);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Xóa giá sản phẩm thất bại'
        })
    }
    return res.status(200).json({
            success: true,
            message: 'Xóa giá sản phẩm thành công'
    });
})
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
            success: true,
            data: response
    });
});
// Tìm kiếm tất cả các sản phẩm
const findAllProduct = asyncHandler(async(req, res) => {
    const response = await ProductService.findAllProduct({
        queries: req.query,
        req: req
    });
    if(!response) {
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy sản phẩm'
        })
    }
    return res.status(200).json({
            success: true,
            data: response.queryExecute,
            count: response.counts
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
            success: true,
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
});
const addAndUpdatePriceProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params;
    console.log(pid);
    const response = await ProductService.addAndUpdatePriceProduct(pid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật giá tiền không thành công thành công'
        });
    }
    return res.status(200).json({
            success: true,
            message: 'Cập nhật giá tiền thành công'
    });
});
// Đánh giá sản phẩm: Thêm + xóa đánh giá
const addRating = asyncHandler(async(req, res) => {
    const response = await ProductService.addRating(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm đánh giá thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm đánh giá thành công'
    });
});
const deleteRating = asyncHandler(async(req, res) => {
    const {pid, rid} = req.params;
    
    if(!pid && rid){
        throw new Error('Không tìm thấy thông tin về đánh giá');
    }
    const response = await ProductService.deleteRating(pid, rid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa đánh giá thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa đánh giá thành công'
    });
});
// Phản hồi
const addReply = asyncHandler(async(req, res) => {
    const {pid, rid} = req.params;
   
    const response = await ProductService.addReply({
        pid: pid, rid: rid, data: req.body});
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm phản hồi thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm phản hồi thành công'
    });
});
const addReplyChild = asyncHandler(async(req, res) => {
    const {pid, cid} = req.params;
    const response = await ProductService.addReplyChild(pid, cid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm phản hồi thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm phản hồi thành công'
    });
});
// Xóa phản hồ
const deleteReply = asyncHandler(async(req, res) => {
    const {pid, rid, repId} = req.params;
    if(!pid || !rid || !repId) throw new Error('Không tìm thấy thông tin về phản hồi');
    const response = await ProductService.deleteReply(pid, rid, repId);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa phản hồi thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa phản hồi thành công'
    });
})
module.exports = {
    addProduct,
    updateProduct,
    findProductById,
    findAllProduct,
    findProductBySlug,
    deleteProduct,
    updateDescriptionProduct,
    addPriceProduct,
    updatePriceProduct,
    deletePriceProduct,
    addAndUpdatePriceProduct,
    addRating, 
    deleteRating,
    addReply,
    addReplyChild,
    deleteReply
}
