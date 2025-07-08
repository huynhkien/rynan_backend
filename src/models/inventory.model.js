const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Product',
    },
    materialId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Material',
    },
    type: {type: String},
    currentStock: {type: Number, default: 0}, // Số lượng hiện tại
    approvedBy: {type: String},
    approvalHistory: [{
        approvedBy: {
            type: mongoose.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        approvedAt: {
            type: Date,
            default: Date.now
        },
        action: {
            type: String,
            enum: ['created', 'updated'],
            required: true
        },
        quantityChange: {
            type: Number,
            default: 0
        },
        previousStock: {
            type: Number,
            default: 0
        },
        newStock: {
            type: Number,
            default: 0
        },
        notes: String
    }],
    minStock: {type: Number, default: 50}, // Mức tồn kho tối thiểu
    location: {
        shelf: String,
        positionCode: String
    }, // Vị trí trong kho
    lastUpdated: {type: Date, default: Date.now}
}, {
    timestamps: true
});

InventorySchema.index({ productId: 1, materialId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', InventorySchema);