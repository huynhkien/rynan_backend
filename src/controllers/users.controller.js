const { generateAccessToken, generateRefreshToken } = require('../middlewares/auth');
const UserService = require('../services/users.service');
const asyncHandler = require('express-async-handler');

// Đăng ký tài khoản
const register = asyncHandler(async(req, res) => {
    const newUser = await UserService.register(req.body);
    if(!newUser){
        return res.status(400).json({
            success: false,
            message: 'Gặp lỗi trong quá trình đăng ký tài khoản.'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Vui lòng check mail để đăng ký tài khoản.'
    })
})
const finalRegister = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    const {token} = req.params;
    if(!cookie || cookie?.cookieRegister?.token !== token ) return res.redirect(`${process.env.URL_CLIENT}/final-register/failed`);
    res.clearCookie('cookieRegister');
    const newUser = await UserService.finalRegister(cookie);
    res.clearCookie('cookieRegister');
    if(!newUser){
        return res.redirect(`${process.env.URL_CLIENT}/final-register/failed`);
    }
    return res.redirect(`${process.env.URL_CLIENT}/final-register/succeeded`);
})
const findUserById = asyncHandler(async(req, res) => {
    const {uid} = req.params;
    const user = UserService.findUserById(uid);
    if(!user){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin người dùng'
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
})
const findAllUser = asyncHandler(async(req, res) => {
    const allUser = UserService.findAllUser();
    if(!allUser){
        res.status(400).json({
            success: true,
            data: user
        });
    }
    res.status(200).json({
        success: true,
        data: user
    });
})
const login = asyncHandler(async(req, res) => {
    const {email, password} = req.params;
    const user = await UserService.login(email, password);
    const accessToken = generateAccessToken(user?._id, userData?.role);
    if(user){
        res.cookie('refreshToken', user?.newRefreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 *60 * 1000});
        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            accessToken: accessToken,
            data: user
        })
    }
    return res.status(400).json({
            success: true,
            message: 'Đăng nhập thất bại'
    })
})
module.exports = {
    register,
    finalRegister,
    findUserById,
    findAllUser,
    login
}