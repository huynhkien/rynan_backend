const mongoose = require('mongoose');

const SpecificationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
  },
  conversionQuantity: {
    type: String,
  },
  packagingWeight: {
    type: String,
  },
  height: {
    type: String,
  },
  length: {
    type: String,
  },
  width: {
    type: String,
  },
  description: {
    type: String
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Specification', SpecificationSchema);
