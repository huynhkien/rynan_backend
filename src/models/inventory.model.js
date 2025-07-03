const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Product',
        required: true
    },
    currentStock: {type: Number, default: 0}, // Số lượng hiện tại
    reservedStock: {type: Number, default: 0}, // Hàng đã đặt chỗ
    availableStock: {type: Number, default: 0}, // Hàng có thể bán
    committedStock: {type: Number, default: 0, min: 0}, // Đã cam kết bán
    minStock: {type: Number, default: 50}, // Mức tồn kho tối thiểu
    maxStock: {type: Number}, // Mức tồn kho tối đa
    location: {type: String}, // Vị trí trong kho
    lastUpdated: {type: Date, default: Date.now}
}, {
    timestamps: true
});


module.exports = mongoose.model('Inventory', InventorySchema);