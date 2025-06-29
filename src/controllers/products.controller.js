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
    const response = await ProductService.updatePriceProduct({
        pid,
        rid,
        updatePrice: req.body.prices
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
// Thêm và cập nhật giá tiền
const addAndUpdatePriceProduct = asyncHandler(async ({ pid, updatePrice }) => {
    const product = await findProductById(pid);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    // Danh sách các loại giá hợp lệ
    const validPriceTypes = [
        'dealerPrice', 'storePrice', 'retailPrice', 'promotionPrice', 
        'internalPrice', 'listedPrice', 'offeringPrice', 'referencePrice'
    ];
    
    const results = {
        updated: [],
        created: [],
        errors: []
    };
    // Xử lý từng loại giá trong updatePrice
    for (const [priceType, priceData] of Object.entries(updatePrice)) {
        // Chỉ xử lý những key là loại giá hợp lệ
        if (!validPriceTypes.includes(priceType)) {
            continue;
        }
        try {
            // Tìm giá hiện tại của loại này
            const existingPriceIndex = product.prices.findIndex(item => item.priceType === priceType);
            if (existingPriceIndex !== -1) {
                // Cập nhật giá hiện tại
                const updateData = {
                    ...product.prices[existingPriceIndex].toObject(),
                    ...priceData,
                    priceType: priceType,
                };
                
                product.prices[existingPriceIndex] = updateData;
                results.updated.push({
                    priceType: priceType,
                    action: 'updated',
                    data: updateData
                });
                
            } else {
                // Thêm giá mới
                if (!priceData.price) {
                    results.errors.push({
                        priceType: priceType,
                        error: 'Giá tiền là bắt buộc khi thêm mới'
                    });
                    continue;
                }
                
                const newPrice = {
                    priceType: priceType,
                    price: Number(priceData.price),
                    startDate: priceData.startDate ? new Date(priceData.startDate) : new Date(),
                    endDate: priceData.endDate ? new Date(priceData.endDate) : null,
                    note: priceData.note || '',
                };
                
                product.prices.push(newPrice);
                results.created.push({
                    priceType: priceType,
                    action: 'created',
                    data: newPrice
                });
            }
        } catch (error) {
            results.errors.push({
                priceType: priceType,
                error: error.message
            });
        }
    }
    // Lưu product sau khi xử lý tất cả
    const savedProduct = await product.save();
    // Tạo message tổng hợp
    let message = '';
    if (results.updated.length > 0) {
        message += `Cập nhật ${results.updated.length} loại giá. `;
    }
    if (results.created.length > 0) {
        message += `Thêm mới ${results.created.length} loại giá. `;
    }
    if (results.errors.length > 0) {
        message += `${results.errors.length} lỗi xảy ra.`;
    }
    
    return {
        success: results.errors.length === 0 || (results.updated.length > 0 || results.created.length > 0),
        message: message.trim(),
        product: savedProduct,
        details: {
            updated: results.updated,
            created: results.created,
            errors: results.errors,
            totalProcessed: results.updated.length + results.created.length,
            totalErrors: results.errors.length
        }
    };
});

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
    deletePriceProduct
}
