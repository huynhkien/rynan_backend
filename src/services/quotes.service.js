const Quote = require('../models/quote.model');
const asyncHandler = require('express-async-handler');
// thêm báo giá
const addQuote = asyncHandler(async(data) => {
    return await Quote.create(data);
})
// Cập nhật báo giá
const updateQuote = asyncHandler(async(id, data) => {
    return await Quote.findByIdAndUpdate(id, data, {new: true});
})
// Tìm báo giá theo id
const findQuoteById = asyncHandler(async(id) => {
    return await Quote.findById({_id: id});
})
// Tìm tất cả các báo giá
const findAllQuote = asyncHandler(async() => {
    return await Quote.find();
})
// Xóa báo giá
const deleteQuote = asyncHandler(async (id) => {
    console.log(id)
    return await Quote.findByIdAndDelete(id);
});
module.exports = {
    addQuote,
    updateQuote,
    findQuoteById,
    findAllQuote,
    deleteQuote,
}