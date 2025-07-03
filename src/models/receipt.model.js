const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    handleBy: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    products: [{
        pid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        name: {type: String},
        quantity: {type: Number, required: true},
        thumb: {type: String},
        price: {type: Number},
        priceType: {type: String},
        batchNumber: {type: String}, // Số lô hàng
        expiryDate: {type: Date}, // Hạn sử dụng
        manufacturingDate: {type: Date} // Ngày sản xuất

    }],
    typeReceipt: {
        type: String,
        enum: ['import', 'export'],
        default: 'import',
        required: true
    },
    exportedTo: {type: mongoose.Types.ObjectId, ref: 'User'},
    code: {type: String, unique: true},
    note: {type: String}, 
    total: {type: String},
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    approvedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
