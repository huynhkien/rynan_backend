const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    products: [{
        pid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        name: {type: String},
        quantity: {type: Number, required: true},
        price: {type: Number},
        specification: {type: String},
        priceType: {type: String},
        batchNumber: {type: String}, // Số lô hàng
        expiryDate: {type: Date}, // Hạn sử dụng
        manufacturingDate: {type: Date} // Ngày sản xuất

    }],
    materials: [{
        mid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        name: {type: String},
        specification: {type: String},
        quantity: {type: Number, required: true},
        price: {type: Number},
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
    produced_at: {type: String},
    deliveryMethod: {type: String},
    deliveryDate: {type: Date},
    supplier: {type: String},
    exportedTo: {type: mongoose.Types.ObjectId, ref: 'User'},
    code: {type: String, unique: true},
    note: {type: String}, 
    total: {type: Number},
    paymentDueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
    },
    approvedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    paymentMethod: {
        type: String,
        enum: ['COD', 'BANK_TRANSFER', 'SCOD', 'ATM', 'CREDIT_CARD'],
    },
    paymentStatus: {
        type: String,
        enum: ['PAID', 'UNPAID', 'PARTIALLY_PAID'],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
