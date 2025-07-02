const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    code: {type: String},
    products: [{
        pid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number},
        name: {type: String},
        price: {type: Number},
        thumb: {type: String},
        priceType: {type: String}
    }],
    status: {
        type: String,
        enum: ['Cancelled', 'Processing', 'Delivering', 'Received' ,'Succeed'],
        default: 'Processing'
    },
    // Thông tin người đặt hàng
    orderBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    },
    total: {type: Number},
    paymentMethod: {
        type: String,
        enum: ['COD', 'BANK_TRANSFER', 'SCOD', 'ATM', 'CREDIT_CARD'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['PAID', 'UNPAID', 'PARTIALLY_PAID'],
        default: 'UNPAID'
    },
    paymentDueDate: {
        type: Date
    },
    note: {type: String},
    staff: {type: String},
    expectedDeliveryDate: {type: Date}
},{
    timestamps: true
})
module.exports = mongoose.model('Order', OrderSchema);