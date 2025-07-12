const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {type: String, maxLength: 255},
    password: {type: String, maxLength: 255},
    email: {type: String, maxLength: 255},
    phone: {type: String, maxLength: 255},
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
    },
    dateOfBirth: {type: Date,},
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        lowercase: true
    },
    avatar: {
        url: String, 
        public_id: String
    },
    role: {
        type: String, 
        enum: [2000, 2002, 2004, 2006],
        default: 2000
    },
    wishlist: [{type: mongoose.Types.ObjectId, ref: 'Product'}],
    // isBlocked: {type: Boolean, default: false},
    lastLoginAt: {type: Date, default: Date.now()},
    refreshToken: {type: String},
    passwordChangedAt: {type: String},
    passwordResetToken: {type: String},
    passwordResetExpires: {type: String},
    registerToken: {type: String},
    type: {type: String, default: 'Đăng ký mới'},
    source: {type: String},
    identification_card: {type: String},
    tax_code: {type: String},
    website: {type: String},
    invoice_address: {type: String},
    staff: {type: mongoose.Types.ObjectId, ref: 'User', default: null},
    code: {type: String},
    note: {type: String}
},{
    timestamps: true
})

// Xử lý hash password
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    const salt = bcrypt.genSaltSync(15);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Xử lý khóa tài khoản
userSchema.pre('save', async function(next) {
    const ninetyDaysAgo = new Date(Date.now() - 90*24*60*60*1000);
    if(this.lastLoginAt && this.lastLoginAt > ninetyDaysAgo) this.isBlocked = true;
    next();
})
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createPasswordChangeToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model('User', userSchema);
