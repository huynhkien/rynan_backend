const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

// Thêm sản phẩm
const addProduct = asyncHandler(async(data) => {
    return await Product.create(data);
});
// Tìm sản phẩm theo id
const findProductById = asyncHandler(async(id) => {
    return await Product.findById(id);
});
// Tìm tất cả sản phẩm
const findAllProduct = asyncHandler(async({queries, req}) => {
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);
    // Định dạng lại các operatirs cho đúng cú pháp của moogose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const  formatQueries = JSON.parse(queryString);

    // Lọc
    let queryObject = {}
    if(queries?.q){
        delete formatQueries.q;
        queryObject = {
        $or: [
            {name_vn: {$regex: queries.q, $options: 'i'}},
            {category: {$regex: queries.q, $options: 'i'}},
        ]
        }
    }
    const qr = {...formatQueries, ...queryObject};

    let queryCommand = Product.find(qr);
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    // giới hạn
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    // phân trang
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // thực thi
    const queryExecute = await queryCommand.exec();
    const counts = await Product.countDocuments(formatQueries)

    return {
        queryExecute,
        counts
    }
});
// Cập nhật sản phẩm
const updateProduct = asyncHandler(async(id, data) => {
    return await Product.findByIdAndUpdate(id, data, {new: true});
});
// Cập nhật bài viết sản phẩm
const updateDescriptionProduct = asyncHandler(async(id, description) => {
    return await Product.findByIdAndUpdate(id, {description}, {new: true});
});
// Thêm giá tiền cho sản phẩm
const AddPriceProduct = asyncHandler(async(id, newPrice) => {
    return await Product.findByIdAndUpdate(id,{ $push: { prices: newPrice } }, {new: true});
});
// Cập nhật giá tiền sản phẩm
const updatePriceProduct = asyncHandler(async({pid, rid, data}) => {
    const product = await findProductById(pid);
    console.log(rid);
    console.log(data)
    if(!product) throw new Error('Không tìm thấy sản phẩm');
    const productPriceIndex = product.prices.findIndex(item => item._id.toString() === rid);
    console.log(productPriceIndex)
    if(productPriceIndex === -1) throw new Error('Không tìm thấy giá tiền của sản phẩm');
    const updateData = {
        ...product.prices[productPriceIndex].toObject(),
        ...data.updatePrice
    }
    product.prices[productPriceIndex] = updateData;
    return product.save();
});
// Xóa thông tin giá tiền trong sản phẩm
const deletePriceProduct = asyncHandler(async(pid, rid) => {
    return await Product.findByIdAndUpdate(
        pid,
        {$pull: {prices: {_id: rid}}},
        {new: true}
    )
})
// Cập nhật lượt bán sản phẩm
const updateSoldProduct = asyncHandler(async(id, sold) => {
    return await Product.findByIdAndUpdate(id, {$inc: {sold: sold}}, {new: true})
});

// Xóa sản phẩm
const deleteProduct = asyncHandler(async(id) => {
    return await Product.findByIdAndDelete({_id: id})
});
// Tìm sản phẩm theo slug
const findProductBySlug = asyncHandler(async(slug) => {
    return await Product.findOne({slug})
});
// Thêm và cập nhật giá tiền
const addAndUpdatePriceProduct = asyncHandler(async (pid, data) => {
    const product = await Product.findById(pid);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    if (!data.updatePrice || !data.updatePrice.price || !data.updatePrice.priceType) {
        throw new Error('Không có dữ liệu về giá');
    }
    const existingPriceType = product.prices.findIndex((el) => el.priceType === data.updatePrice.priceType);
    
    if(existingPriceType !== -1){
        product.prices[existingPriceType] = {
            ...product.prices[existingPriceType].toObject(),
            ...data.updatePrice
        }
    } else {
        product.prices.push(data.updatePrice);
    }
    
    const savedProduct = await product.save();
    return savedProduct;
});
// Đánh giá sản phẩm: Thêm đánh giá + Xóa đánh giá
const addRating = asyncHandler(async(data) => {
    if(!data) throw new Error('Thiếu thông tin!');
    console.log(data);
    await Product.findByIdAndUpdate(data.pid, {
        $push:  {ratings: {
                    star: data.star, 
                    comment: data.comment,
                    postedBy: data.uid, 
                },
        }}, {new: true} );
    // Tính toán lại đánh giá
    const product = await Product.findById(data.pid);
    console.log(product);
    const ratingCount = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, item) => sum + +item.star, 0);
    product.totalRatings = sumRatings / ratingCount ;
    return product.save();
})

const deleteRating = asyncHandler(async (pid, rid) => {
    const product = await Product.findById(pid);
    if (!product) {
        throw new Error('Không tìm thấy sản phẩm');
    }
    // Tìm đánh giá
    const ratingIndex = product.ratings.findIndex(el => el._id.toString() === rid);
    if (ratingIndex === -1) {
        throw new Error('Không tìm thấy đánh giá')
    }
    // Xóa đánh giá
    product.ratings.splice(ratingIndex, 1);
    // Tính toán lại đánh giá
    const ratingCount = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, el) => sum + +el.star, 0);
    product.totalRatings = ratingCount > 0 ? sumRatings/ratingCount : 0; 
    return product.save();
});
// Phản hồi
const addReply = asyncHandler( async (pid, rid, data) => {
    if(!pid || !rid) throw new Error('Thiếu thông tin sản phẩm');
    if(!data) throw new Error('Vui lòng thêm thông tin');
    return await Product.findOneAndUpdate(
        { _id: pid, 'ratings._id': rid },
        {
            $push: {
            'ratings.$.replies': {
                replier: data.replier,
                feedBack: data.feedBack,
                postedBy: data.postedBy, 
            }}
        },
        { new: true } 
        );
});
const addReplyChild = asyncHandler(async (pid, cid, data) => {
  return await Product.findOneAndUpdate(
    { _id: pid, 'ratings.replies._id': cid }, 
    {
      $push: {
        'ratings.$.replies': {
            replier: data.replier,
            feedBack: data.feedBack,
            postedBy: data.postedBy, 
        },
      },
    },
    { new: true });
});
module.exports = {
    addProduct,
    updateProduct,
    findProductById, 
    findAllProduct,
    deleteProduct,
    findProductBySlug,
    updateSoldProduct,
    updateDescriptionProduct,
    AddPriceProduct,
    updatePriceProduct,
    deletePriceProduct,
    addAndUpdatePriceProduct,
    addRating,
    deleteRating,
    addReply, 
    addReplyChild
}
