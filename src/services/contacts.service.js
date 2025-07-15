const Contact = require('../models/contact.model');
const asyncHandler = require('express-async-handler');
const sendMail = require('../utils/sendMail');
// thêm liên hệ
const addContact = asyncHandler(async(data) => {
    if(!data) throw new Error('Không có dữ liệu');
    return await Contact.create(data);
})
// Gửi mail
const sendMailContact = asyncHandler(async(data) => {
    if(!data) throw new Error('Không có dữ liệu');
    try {
        const result = await sendMail({
            email: data.email, 
            html: data.html, 
            subject: data.subject
        });
        await Contact.findOneAndUpdate(
            { email: data.email },
            { $set: { status: 'replied' } },
            { new: true }
        );
        return result;
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
});
// Tìm liên hệ theo id
const findContactById = asyncHandler(async(id) => {
    if(!id) throw new Error('Không có dữ liệu');
    return await Contact.findById({_id: id});
})
// Tìm tất cả các liên hệ
const findAllContact = asyncHandler(async() => {
    return await Contact.find();
})
// Xóa liên hệ
const deleteContact = asyncHandler(async (id) => {
    if(!id) throw new Error('Không có dữ liệu');
    return await Contact.findByIdAndDelete(id);
});
module.exports = {
    addContact,
    sendMailContact,
    findContactById,
    findAllContact,
    deleteContact,
}