const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Product',
        required: true
    },
    minStock: {type: Number, default: 0}, // Mức tồn kho tối thiểu
    maxStock: {type: Number}, // Mức tồn kho tối đa
    location: {type: String}, // Vị trí trong kho
    lastUpdated: {type: Date, default: Date.now}
}, {
    timestamps: true
});

// Đảm bảo một sản phẩm chỉ có một record trong một warehouse
InventorySchema.index({ productId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', InventorySchema);