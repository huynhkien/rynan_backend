const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const ProductSchema = new mongoose.Schema({
    code: {type: String},
    name_vn: {type: String, required: true},
    name_eng: {type: String},
    name_short: {type: String},
    thumb: {
        url: String,
        public_id: String
    },
    sold: {type: Number, default: 0},
    category: {type: String},
    tags: [{ tag: String }],
    prices: [
        {
            priceType: String,                  
            price: Number,                    
            startDate: Date,                
            endDate: Date,                  
            note: String,       
        }
    ],
    price_reference: {type: Number, required: true},
    specification: {type: String},
    origin: {type: String},
    slug: {type: String, slug: 'name_vn'},
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
    isActive: {
        type: String,
        default: "Đang bán"
    },
    totalRatings: {type: Number, default: 0},
    description: {type: String, default: ''},
    joinTime: {type: Date}
},{
    timestamps: true
});
// Tạo slug tự động
mongoose.plugin(slug);
module.exports = mongoose.model('Product', ProductSchema);

