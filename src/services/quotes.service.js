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
});
// Xóa sản phẩm trong báo giá
const deleteProductQuote = asyncHandler(async (qid, pid) => {
  const quote = await Quote.findById(qid);
  const productQuoteIndex = quote?.products?.findIndex((el) => el.pid.toString() === pid);
  if (productQuoteIndex === -1) {
      throw new Error('Không tìm thấy sản phẩm trong báo giá')
    }
    // Xóa
    quote.products.splice(productQuoteIndex, 1);
    return await quote.save();
});
// Xóa báo giá
const deleteQuote = asyncHandler(async (id) => {
    return await Quote.findByIdAndDelete(id);
});
module.exports = {
    addQuote,
    updateQuote,
    findQuoteById,
    findAllQuote,
    deleteQuote,
    deleteProductQuote
}