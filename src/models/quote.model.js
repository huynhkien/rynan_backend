const mongoose = require('mongoose');
const QuoteSchema = new mongoose.Schema({
    client: {type: mongoose.Types.ObjectId, name: 'User'},
    products: [{
        pid: {type: mongoose.Types.ObjectId, name: 'Product'}
    }],
    quotation: {type: String}
},{
    timestamps: true
});

module.exports = mongoose.model('Quote', QuoteSchema);

