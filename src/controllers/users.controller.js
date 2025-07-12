const { generateAccessToken, generateRefreshToken } = require('../middlewares/auth');
const UserService = require('../services/users.service');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
// Đăng ký tài khoản
const register = asyncHandler(async(req, res) => {
    const newUser = await UserService.register(req.body, res);
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
// Xác thực tài khoản
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
// Tìm kiếm thông tin theo id
const findUserById = asyncHandler(async(req, res) => {
    const {uid} = req.params;
    const user = await UserService.findUserById(uid);
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
// Thêm thông tin người dùng
const addUserByAdmin = asyncHandler(async(req, res) => {
    console.log(req.body)
    if(req.file) req.body.avatar = {
        url: req.file.path,
        public_id: req.file.filename
    }
    if(req.body.address){
        req.body.address = JSON.parse(req.body.address);
    }
    const response = await UserService.addUserByAdmin(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thêm thông tin thất bại'
        })
    }
    res.status(200).json({
        success: true,
        message: 'Thêm thông tin thành công'
    })
})
// Tìm theo thông tin lưu trong token
const findUserByToken = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    const user = await UserService.findUserById(_id);
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
const login = asyncHandler(async(req, res) => {
    const response = await UserService.login({email: req.body.email, password: req.body.password, res: res});
    if(response){
        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            accessToken: response?.accessToken,
            data: response.user
        })
    }
    return res.status(400).json({
            success: true,
            message: 'Đăng nhập thất bại'
    })
})
// Đăng xuất tài khoản
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie || !cookie.refreshToken) throw new Error('Không có refreshToken. Vui lòng kiểm tra hệ thống!!!');
    await UserService.logout(cookie);
    res.clearCookie('refreshToken', {httpOnly: true, secure: true});
    return res.status(200).json({
        success: true, 
        message: 'Đăng xuất thành công.'
    })
})
// Quên mật khẩu
const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    if(!email) throw new Error('Vui lòng nhập email để lấy lại mật khẩu');
    const response = await UserService.forgotPassword(email);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Thất bại, vui lòng thử lại'
        })
    }
     return res.status(200).json({
            success: true,
            message: 'Vui lòng check mail để lấy lại mật khẩu'
        })
}) 
const resetPassword = asyncHandler(async(req, res) => {
    const {password, token} = req.body;
    const response = await UserService.resetPassword(password, token);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật mật khẩu thất bại'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật mật khẩu thành công'
    })
})
const findAllUser = asyncHandler(async(req, res) => {
    const response = await UserService.findAllUser();
    if(!response){
        res.status(400).json({
            success: false,
            data: 'Không tìm thấy thông tin nguời dùng'
        });
    }
    res.status(200).json({
        success: true,
        data: response
    });
})
// Cập nhật thông tin người dùng
const updateInfoByUser = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    const avatar = req.file ? req.file.path : null;
    if(avatar) req.body.avatar = {
        url: req.file.path,
        public_id: req.file.name
    }
    if(req.body.password){
        const salt = bcrypt.genSaltSync(15);
        req.body.password = await bcrypt.hash(req.body.password, salt);

    }else{
        delete req.body.password;
    }
    const response = await UserService.updateInfoByUser(_id, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật thông tin thất bại'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công'
    })
})
const updateInfoByAdmin = asyncHandler(async(req, res) => {
    const {uid} = req.params;
    console.log(uid);
    console.log(req.body)
    if(req.body?.password){
        const salt = bcrypt.genSaltSync(15);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const response = await UserService.updateInfoByAdmin(uid, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật thông tin thất bại'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công'
    })
})
// Cập nhật địa chỉ
const updateAddress = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    const response = await UserService.updateAddress(_id, req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Cập nhật thông tin thất bại'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công'
    })
});
// Xóa thông tin người dùng
const deleteUser = asyncHandler(async(req, res) => {
    const {uid} = req.params;
    const response = await UserService.deleteUser(uid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa thông tin thất bại'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa thông tin thành công'
    })
});
// Phân quyền nhân viên
const addRole = asyncHandler(async(req, res) => {
    if(req.file) req.body.avatar = {
        url: req.file.path,
        public_id: req.file.filename
    }
    req.body.password = '123456789';
    const response = await UserService.addRole(req.body);
    if(!response) {
        return res.status(400).json({
            success: false,
            message: 'Phân quyền người dùng không thành công'
        });
    }
    return res.status(200).json({
            success: true,
            message: 'Phân quyền người dùng thành công'
    });
})
// check mail
const checkMail = asyncHandler(async(req, res) => {
    const {email} = req.body;
    console.log(email)
    const response = await UserService.checkMail(email);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Email không tồn tại, vui lòng nhập email khác.'
        });
    }
    return res.status(200).json({
            success: true,
            message: 'Email tồn tại'
        });
})
module.exports = {
    register,
    finalRegister,
    findUserById,
    findUserByToken,
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
    addRole,
    checkMail
}
