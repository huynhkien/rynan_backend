const QuoteService = require('../services/quotes.service');
const asyncHandler = require('express-async-handler');
// Thêm báo giá
const addQuote = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin báo giá');
    const response = await QuoteService.addQuote(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm báo giá thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Thêm báo giá thành công'
    });
});
// Cập nhật báo giá
const updateQuote = asyncHandler(async(req, res) => {
    const {qid} = req.params;
    const response = await QuoteService.updateQuote(qid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật báo giá thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật báo giá thành công'
    });
});
// Tìm báo giá theo id
const findQuoteById = asyncHandler(async(req, res) => {
    const {qid} = req.params;
    const response = await QuoteService.findQuoteById(qid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy báo giá'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các báo giá
const findAllQuote = asyncHandler(async(req, res) => {
    const response = await QuoteService.findAllQuote();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy báo giá'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa báo giá
const deleteQuote = asyncHandler(async(req, res) => {
    const {qid} = req.params;
    const response = await QuoteService.deleteQuote(qid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa báo giá thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa báo giá thành công'
    });
});
module.exports = {
    addQuote,
    updateQuote,
    findQuoteById,
    findAllQuote,
    deleteQuote
}

