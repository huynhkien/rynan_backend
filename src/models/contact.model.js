const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Vui lòng nhập họ tên'], },
  email: { type: String, required: [true, 'Vui lòng nhập email']},
  phone: {type: String, required: true },
  address: {type: String, required: true},
  message: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung liên hệ'],
    minlength: 5
  },
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending'
  },
},
{
    timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);
