const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const {templateMailAuth} = require('../utils/emailTemplate');
const sendMail = require('../utils/sendMail');
const axios = require('axios');
const config = require('../config/config');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/auth');


// Xác thực tài khoản 
const register = asyncHandler(async(data, res) => {
    if(!(data?.name && data?.password && data?.phone && data?.email && data.code)) throw new Error('Vui lòng điền đầy đủ các thông tin cần thiết.');
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
        code: cookie?.cookieRegister?.code,
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
    res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 7 * 24 * 60 *60 * 1000 });
    await User.findByIdAndUpdate(
        user?._id,
        {refreshToken: newRefreshToken},
        {new: true}
    );
    // Kiểm tra tra tra tài khoản đã bị khóa chưa
    if(user.isBlocked) throw new Error('Tài khoản đã bị khóa. Vui lòng liên hệ admin để mới khóa tài khoản');
    user.lastLoginAt = Date.now();
    return {
        accessToken,
        user
    }
})
// Đăng xuất tài khoản
const logout = asyncHandler(async(res, cookie) => {
    const response = await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true});
    if(response){
        res.clearCookie('accessToken', {httpOnly: true, secure: true});
        res.clearCookie('refreshToken', {httpOnly: true, secure: true});
    }else{
        throw new Error('Lỗi cập nhật')
    }
    return response;
})
// Quên mật khẩu
const forgotPassword = asyncHandler(async(email) => {
    if(!email) throw new Error('Không tìm thất email');
    const user = await User.findOne({email});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng.');
    const resetToken = user.createPasswordChangeToken();
    const html = templateMailAuth({title: 'Quên mật khẩu', name: user?.name, type: 'forgotPassword', url: `${process.env.URL_CLIENT}/reset-password/${resetToken}`});
    await sendMail({email, html, subject: 'Quên mật khẩu'});
    return await user.save();
})
const resetPassword = asyncHandler(async(password, token) => {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({passwordResetToken, passwordResetExpires:{$gt: Date.now()}});
    if(!user) throw new Error('Không tìm thấy thông tin người dùng');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    return await user.save();
    

})
// Thêm thông tin 
const addUserByAdmin = asyncHandler(async(data) => {
    console.log(data);
    if(data.address && typeof data.address === 'string') {
        data.address = JSON.parse(data.address);
    }
    return await User.create(data);
})
// Cập nhật thông tin người dùng 
const updateInfoByUser = asyncHandler(async(id, data) => {
    if(data.address && typeof data.address === 'string') {
        data.address = JSON.parse(data.address);
    }
    return await User.findByIdAndUpdate(id, data, {new: true}).select('-password -role');
})
const updateInfoByAdmin = asyncHandler(async(id, data) => {
    if(data.address && typeof data.address === 'string') {
        data.address = JSON.parse(data.address);
    }
    const result = await User.findByIdAndUpdate(id, data, {new: true});
    if(data?.password){
        const html = templateMailAuth({title: 'Thay đổi mật khẩu', name: data?.name, password: data?.password});
        await sendMail({email: data.email, html, subject: 'Thay đổi mật khẩu'});
    }
    return result;
});
// Cập nhật địa chỉ người dùng
const updateAddress = asyncHandler(async(id, data) => {
    if(data && typeof data === 'string') {
        data = JSON.parse(data);
    }
    return await User.findByIdAndUpdate(id, {address: data}, {new: true});
})
// Xóa thông tin
const deleteUser = asyncHandler(async(id) => {
    return await User.findByIdAndDelete(id);
});
// Thêm quyền
const addRole = asyncHandler(async(data) =>{
    if(!data) throw new Error('Thiếu thông tin nhân viên, vui lòng nhập đầy đủ thông tin');
    console.log(data);
    if(data.address && typeof data.address === 'string') {
        data.address = JSON.parse(data.address);
    }
    const user = await User.findOne({email: data?.email});
    if(user) throw new Error('Email đã được đăng ký !');
    const html = templateMailAuth({title: 'Phân quyền nhân viên', name: data?.name, rolePassword: data?.password});
    await sendMail({email: data.email, html, subject: 'Hoàn tất phân quyền nhân viên'});
    return await User.create(data);
});
// Check mail
const checkMail = asyncHandler(async (email) => {
    if (!email) throw new Error('Email không hợp lệ');

    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${config.abstract_api_key.key}&email=${email}`);
    
    const isValid = response.data.deliverability === 'DELIVERABLE';

    return isValid;
});    
// Thêm sản phẩm vào danh sách yêu thích
const addFavorite = asyncHandler(async (uid, pid) => {
    const user = User.findById(uid);
    if(!user) throw new Error('Không tìm thấy thông tin người dùng')
    const alreadyInWishList = user.wishlist?.includes(pid);
    if (alreadyInWishList) {
        return await User.findByIdAndUpdate(
            uid,
            { $pull: { wishlist: pid } },
            { new: true }
        );
    } else {
        return await User.findByIdAndUpdate(
            uid,
            { $push: { wishlist: pid } },
            { new: true }
        );
    }
});
module.exports = {
    register,
    addRole,
    finalRegister,
    findUserById,
    findAllUser,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateInfoByUser,
    updateInfoByAdmin,
    updateAddress,
    addUserByAdmin,
    deleteUser,
    checkMail,
    addFavorite
}