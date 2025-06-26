const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {type: String, maxLength: 255, required: true},
    password: {type: String, maxLength: 255, required: true},
    email: {type: String, maxLength: 255, required: true},
    phone: {type: String, maxLength: 255, required: true},
    address: {
        street: {type: String, maxLength: 255},
        city: {type: String, maxLength: 100},
        ward: {type: String, maxLength: 100},
        district: {type: String, maxLength: 100},
        country: {type: String, maxLength: 100, default: 'Vietnam'},
        zipCode: {type: String, maxLength: 20}
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
    lastLoginAt: {type: Date},
    refreshToken: {type: String},
    passwordChangedAt: {type: String},
    passwordResetToken: {type: String},
    passwordResetExpires: {type: String},
    registerToken: {type: String},
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
