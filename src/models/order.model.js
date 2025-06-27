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
    // Thông tin người đặt hàng
    orderBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    },
    total: {type: Number},
    // Thông tin người nhận hàng => thông tin chỉ xuất hiện khi nhân viên thực hiện nhập đơn hàng 
    recipient: {
        name: String,
        phone: String,
        address: {
            province: { code: Number, name: String },
            district: { code: Number, name: String },
            ward: { code: Number, name: String },
            detail: String,       
            addressAdd: String   
        }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'VNPay', 'Momo', 'ZaloPay'],
        default: 'COD'
    },
    note: {type: String},
    staff: {type: String},
    expectedDeliveryDate: {type: Date}
},{
    timestamps: true
})
module.exports = mongoose.model('Order', OrderSchema);