const mongoose = require('mongoose');

const WarehouseSchema = mongoose.Schema({
    handleBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    products: [{
        pid: {type: mongoose.Types.ObjectId, ref: 'Product'},
        name: {type: String},
        quantity: {type: Number},
        price: {type: Number},
        total: {type: Number},
    }],
    type: {
        type: String,
        enum: ['import', 'export'],
        default: 'import'
    },
    total: {type: Number},
    exportedTo: {
        name: {type: String},
        address: {type: String},
        phone: {type: String},
        email: {type: String}
    }
},{
    timestamps: true
});
module.exports = mongoose.model('Warehouse', WarehouseSchema);