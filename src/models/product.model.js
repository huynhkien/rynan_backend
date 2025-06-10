const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    sku: {type: String, required: true},
    thumb: {
        url: String,
        public_id: String
    },
    sold: {type: Number, default: 0},
    category: {type: mongoose.Types.ObjectId, ref: 'Category'},
    price: {type: Number, required: true},
    specification: {type: String, required: true},
    slug: {type: String, slug: 'name', required: true},
    ratings: [
        {
            star: {type: Number},
            postedBy: {type: String},
            postedByName: {type: String},
            comment: {type: String},
            like: {type: String},
            replies: [{
                replier: {type: String},
                replierName: {type: String},
                feedBack: {type: String},
                createdAt: {type: Date, default: Date.now()},
                postedBy: {type: String}
            }]
        }
    ],
    totalRatings: {type: Number, default: 0},
    description: {type: String, required: true},
    joinTime: {type: Date}
},{
    timestamps: true
});
// Tạo slug tự động
mongoose.plugin(slug);
module.exports = mongoose.model('Product', ProductSchema);

