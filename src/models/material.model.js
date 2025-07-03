const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  name_short: {type:String},
  code: { type: String, unique: true },   
  note: { type: String },         
  specification: { type: mongoose.Types.ObjectId, ref: 'Specification' }, 
}, {
  timestamps: true
});

module.exports = mongoose.model('Material', MaterialSchema);
