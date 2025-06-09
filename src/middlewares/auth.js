const jwt = require ('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// Hàm tạo accessToken
const generateAccessToken =  (uid, role) => {
    return jwt.sign({_id: uid, role}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

// Hàm tạo refreshToken
const generateRefreshToken = (uid) => {
    return jwt.sign({_id: uid}, process.env.JWT_SECRET, {expiresIn: '7d'});
}
// Xác thực accessToken
const verifyAccessToken = asyncHandler(async(req, res, next) => {
    // Kiểm tra header Authorization có bắt đầu bằng Bearer không?
    if(req?.header?.authorization?.startsWith('Bearer')) {
        const token = req.header.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if(error) {
                return res.status(401).json({
                    success: false,
                    message: 'AccessToken không hợp lệ'
                });
            }
            req.user = decode;
            next();
        });
    }else{
        return res.status(401).json({
            success: false,
            message: 'Yêu cầu xác thực'
        });
    }
});

// Kiểm tra quyền của người dùng
const checkUserPermission = asyncHandler(async(req, res, next) => {
    const {role} = req.user;
    if(+role !== 2006 && +role !== 2004 && +role !==2002 ){
        return res.status(401).json({
            success: false,
            message: 'Bạn không có quyền thao tác'
        });
    }
    next();


})





module.exports = {
    generateAccessToken, 
    generateRefreshToken,
    verifyAccessToken,
    checkUserPermission
};