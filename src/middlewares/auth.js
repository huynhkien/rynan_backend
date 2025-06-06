const jwt = require ('jsonwebtoken');

// Hàm tạo accessToken
const generateAccessToken =  (uid, role) => {
    return jwt.sign({_id: uid, role}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

// Hàm tạo refreshToken
const generateRefreshToken = (uid) => {
    return jwt.sign({_id: uid}, process.env.JWT_SECRET, {expiresIn: '7d'});
}





module.exports = {
    generateAccessToken, 
    generateRefreshToken
};