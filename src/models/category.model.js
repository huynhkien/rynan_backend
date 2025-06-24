const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
const CategorySchema = new mongoose.Schema({
    name: {type: String, maxLength: 255, required: true},
    thumb: {
        url: String,
        public_id: String
    },
    description: {type: String},
    slug: {type: String, slug: 'name', unique: true, slugPaddingSize: 4 },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null 
    },
    level: {type: Number, default: 0}
},{
    timestamps: true
})
// Tạo slug tự động
mongoose.plugin(slug);
module.exports = mongoose.model('Category', CategorySchema);