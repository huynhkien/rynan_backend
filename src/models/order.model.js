const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    products: [{
        pid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number},
        name: {type: String},
        price: {type: Number},
        thumb: {type: String}
    }],
    status: {
        type: String,
        enum: ['Cancelled', 'Processing', 'Delivering', 'Received' ,'Succeed'],
        default: 'Processing'
    },
    orderBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    },
    total: {type: Number}
},{
    timestamps: true
})
module.exports = mongoose.model('Order', OrderSchema);