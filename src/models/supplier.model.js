const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 255 },         // Tên nhà cung cấp
  code: { type: String, unique: true },                           // Mã nhà cung cấp (NCC001, etc.)
  
  contactPerson: { type: String },                                // Người liên hệ chính
  phone: { type: String },                                        // Số điện thoại
  email: { type: String },                                        // Email

  address: {
        province: {
            code: Number,
            name: String
        },
        district: {
            code: Number,
            name: String
        },
        ward: {
            code: Number,
            name: String
        },
        detail: {type: String},
        addressAdd: {type: String}
    },                                                              // Địa chỉ
  taxCode: { type: String },                                      // Mã số thuế (nếu có)
  bankAccount: {
    bankName: { type: String },
    accountNumber: { type: String }
  },

  note: { type: String },                                         // Ghi chú khác
  isActive: { type: Boolean, default: true },                     // Trạng thái hoạt động
}, {
  timestamps: true
});

module.exports = mongoose.model('Supplier', SupplierSchema);
