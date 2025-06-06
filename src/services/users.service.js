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
    // Tạo accessToken và refreshToken
    const accessToken = generateAccessToken(user?._id, userData?.role);
    const newRefreshToken = generateRefreshToken(user?._id);
    // Tìm thông tin người dùng theo email
    const user = User.findOne({email});
    if(!(user && await user.isCorrectPassword(password))) throw new Error('Không tìm thấy thông tin người dùng hoặc mật khẩu không chính xác.');
    await User.findByIdAndUpdate(user?._id, {refreshToken: newRefreshToken});
})
module.exports = {
    register,
    finalRegister,
    findUserById,
    findAllUser,
    login
}