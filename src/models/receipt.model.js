const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    handleBy: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    products: [{
        pid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, required: true},
    }],
    typeReceipt: {
        type: String,
        enum: ['import', 'export'],
        default: 'import',
        required: true
    },
    exportedTo: {
        name: {type: String},
        address: {type: String},
        phone: {type: String},
        email: {type: String}
    },
    receiptNumber: {type: String, unique: true},
    notes: {type: String} 
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
