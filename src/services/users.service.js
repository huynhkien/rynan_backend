const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const {templateMailAuth} = require('../utils/emailTemplate');
const sendMail = require('../utils/sendMail');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/auth');


// Xác thực tài khoản 
const register = asyncHandler(async(data, res) => {
    if(!(data?.name && data?.password && data?.phone && data?.email)) throw new Error('Vui lòng điền đầy đủ các thông tin cần thiết.');
    // Kiểm tra email đã tồn tại trong hệ thống hay chưa
    const existingEmail = await User.findOne({email: data?.email});
    if(existingEmail) throw new Error('Email đã tồn tại. Vui lòng chọn email khác để đăng ký tài khoản');
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('cookieRegister', {...data, token}, {httpOnly: true, maxAge: 15*60*1000});
    const html = templateMailAuth({title: 'Xác thực tài khoản', name: data?.name, type: 'register', url: `${process.env.URL_SERVER}/api/user/final-register/${token}`})
    return await sendMail({email: data.email, html, subject: 'Hoàn tất đăng ký tài khoản'});
})
// Tạo tài khoản người dùng
const finalRegister = asyncHandler(async(cookie) => {
    return await User.create({
        email: cookie?.cookieRegister?.email,
        password: cookie?.cookieRegister?.password,
        name: cookie?.cookieRegister?.name,
        phone: cookie?.cookieRegister?.phone,
    })
});
// Tìm kiếm người dùng theo _id
const findUserById = asyncHandler(async(id) => {
    return await User.findById({_id: id});

})
// Tìm kiếm tất cả người dùng
const findAllUser = asyncHandler(async() => {
    return await User.find();
})
// Đăng nhập tài khoản
const login = asyncHandler(async({email, password, res}) => {
    if(!email && !password) throw new Error('Thiếu thông tin email hoặc password');
    // Tìm thông tin người dùng theo email
    const user = await User.findOne({email});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng.')
    if(!await user.isCorrectPassword(password)) throw new Error('Thông tin mật khẩu không chính xác.');
        // tạo accessToken và refreshToken
    const accessToken = generateAccessToken(user?._id, user?.role);
    const newRefreshToken = generateRefreshToken(user?._id);
    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 *60 * 1000});
    // Kiểm tra tra tra tài khoản đã bị khóa chưa
    if(user.isBlocked) throw new Error('Tài khoản đã bị khóa. Vui lòng liên hệ admin để mới khóa tài khoản');
    user.lastLoginAt = Date.now();
    return {
        accessToken,
        user
    }
})
const updateRefreshToken = asyncHandler(async(id, refreshToken) => {
    return await User.findByIdAndUpdate(
        id,
        {refreshToken},
        {new: true}
    );
});
// Đăng xuất tài khoản
const logout = asyncHandler(async(cookie) => {
    return await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true});
})
// Quên mật khẩu
const forgotPassword = asyncHandler(async(email) => {
    const user = User.findOne({email});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng.');
    const resetToken = user.createPasswordChangeToken();
    await user.save();
    const html = templateMailAuth({title: 'Quên mật khẩu', name: data?.name, type: 'forgotPassword', url: `${process.env.URL_CLIENT}/forgot-password/${resetToken}`});
    return await sendMail({email, html, subject: 'Quên mật khẩu'});
})
const resetPassword = asyncHandler(async(password, token) => {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now() + 15*60*1000}});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    return await user.save();
    

})
// Thêm thông tin 
const addUserByAdmin = asyncHandler(async(data) => {
    return await User.create(data);
})
// Cập nhật thông tin người dùng 
const updateInfoByUser = asyncHandler(async(id, data) => {
    return await User.findByIdAndUpdate(id, data, {new: true}).select('-password -role');
})
const updateInfoByAdmin = asyncHandler(async(id, data) => {
    const result = await User.findByIdAndUpdate(id, data, {new: true});
    if(data?.password){
        const html = templateMailAuth({title: 'Thay đổi mật khẩu', name: data?.name, password: data?.password});
        await sendMail({email, html, subject: 'Thay đổi mật khẩu'});
    }
    return result;
});
// Cập nhật địa chỉ người dùng
const updateAddress = asyncHandler(async(id, data) => {
    return await User.findByIdAndUpdate(id, {address: data}, {new: true});
})
// Xóa thông tin
const deleteUser = asyncHandler(async(id) => {
    return await User.findByIdAndDelete(id);
});
// Thêm quyền
const addRole = asyncHandler(async(data) =>{
    if(!data) throw new Error('Thiếu thông tin nhân viên, vui lòng nhập đầy đủ thông tin');
    const user = await User.findOne({email: data?.email});
    if(user) throw new Error('Email đã được đăng ký !');
    const html = templateMailAuth({title: 'Phân quyền nhân viên', name: data?.name, rolePassword: data?.password});
    await sendMail({email, html, subject: 'Hoàn tất phân quyền nhân viên'});
    return await User.create(req.body);
});
// Check mail
const checkMail = asyncHandler(async (email) => {
    if (!email) throw new Error('Email không hợp lệ');

    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${config.abstract_api_key.key}&email=${email}`);
    
    const isValid = response.data.deliverability === 'DELIVERABLE';

    return isValid;
});    
module.exports = {
    register,
    addRole,
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
    addUserByAdmin,
    deleteUser,
    checkMail
}