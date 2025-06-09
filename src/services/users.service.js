const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const {templateMailAuth} = require('../utils/emailTemplate');
const sendMail = require('../utils/sendMail');


// Xác thực tài khoản 
const register = asyncHandler(async(data) => {
    if(!(data?.name && data?.password && data?.phone && data?.email)) throw new Error('Vui lòng điền đầy đủ các thông tin cần thiết.');
    // Kiểm tra email đã tồn tại trong hệ thống hay chưa
    const existingEmail = User.findOne({email: data?.email});
    if(existingEmail) throw new Error('Email đã tồn tại. Vui lòng chọn email khác để đăng ký tài khoản');
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('cookieRegister', {...data, token}, {httpOnly: true, maxAge: 15*60*1000});
    const html = templateMailAuth({title: 'Xác thực tài khoản', name: data?.name, type: 'register', url: `${process.env.URL_SERVER}/api/user/final-register/${token}`})
    await sendMail({email, html, subject: 'Hoàn tất đăng ký tài khoản'});
})
// Tạo tài khoản người dùng
const finalRegister = asyncHandler(async(cookie) => {
    await User.create({
        email: cookie?.cookieRegister?.email,
        password: cookie?.cookieRegister?.password,
        name: cookie?.cookieRegister?.name,
        phone: cookie?.cookieRegister?.phone,
    })
});
// Tìm kiếm người dùng theo _id
const findUserById = asyncHandler(async(id) => {
    if(!id) throw new Error('Không tìm thấy id của người dùng');
    await User.findById({_id: id});

})
// Tìm kiếm tất cả người dùng
const findAllUser = asyncHandler(async() => {
    await User.find();
})
// Đăng nhập tài khoản
const login = asyncHandler(async({email, password}) => {
    if(!(email && password)) throw new Error('Thiếu thông tin email hoặc password');
    // Tìm thông tin người dùng theo email
    const user = User.findOne({email});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng.')
    const isValidPassword = await user.isCorrectPassword(password);
    if(!isValidPassword) throw new Error('Thông tin mật khẩu không chính xác.');
    // Kiểm tra tra tra tài khoản đã bị khóa chưa
    if(user.isBlocked) throw new Error('Tài khoản đã bị khóa. Vui lòng liên hệ admin để mới khóa tài khoản');
    user.lastLoginAt = Date.now();
    await user.save();
    return user;
})
const updateRefreshToken = asyncHandler(async(id, refreshToken) => {
    await User.findByIdAndUpdate(
        id,
        {refreshToken},
        {new: true}
    );
});
// Đăng xuất tài khoản
const logout = asyncHandler(async(cookie) => {
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true});
})
// Quên mật khẩu
const forgotPassword = asyncHandler(async(email) => {
    const user = User.findOne({email});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng.');
    const resetToken = user.createPasswordChangeToken();
    await user.save();
    const html = templateMailAuth({title: 'Quên mật khẩu', name: data?.name, type: 'forgotPassword', url: `${process.env.URL_CLIENT}/forgot-password/${resetToken}`});
    await sendMail({email, html, subject: 'Quên mật khẩu'});
})
const resetPassword = asyncHandler(async(password, token) => {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now() + 15*60*1000}});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    

})
// Cập nhật thông tin người dùng 
const updateInfoByUser = asyncHandler(async(id, data) => {
    await User.findByIdAndUpdate(id, data, {new: true}).select('-password -role');
})
const updateInfoByAdmin = asyncHandler(async(id, data) => {
    await User.findByIdAndUpdate(id, data, {new: true});
    const html = templateMailAuth({title: 'Thay đổi mật khẩu', name: data?.name, password: data?.password});
    await sendMail({email, html, subject: 'Thay đổi mật khẩu'});
});
// Cập nhật địa chỉ người dùng
const updateAddress = asyncHandler(async(id, data) => {
    await User.findByIdAndUpdate(id, {address: data}, {new: true});
})
module.exports = {
    register,
    finalRegister,
    findUserById,
    findAllUser,
    login,
    updateRefreshToken,
    logout,
    forgotPassword,
    resetPassword,
    updateInfoByUser,
    updateInfoByAdmin,
    updateAddress,
}