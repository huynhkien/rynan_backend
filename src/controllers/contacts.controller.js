const ContactService = require('../services/contacts.service');
const asyncHandler = require('express-async-handler');
// Thêm liên hệ
const addContact = asyncHandler(async(req, res) => {
    if(!req.body) throw new Error('Thiếu thông tin liên hệ');
    const response = await ContactService.addContact(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Tạo liên hệ thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Tạo liên hệ thành công'
    });
});
// Cập nhật liên hệ
const sendMailContact = asyncHandler(async(req, res) => {
    const response = await ContactService.sendMailContact(req.body);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Gửi mail thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Gửi mail thành công'
    });
});
// Tìm liên hệ theo id
const findContactById = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    const response = await ContactService.findContactById(cid);
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy liên hệ'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Tìm tất cả các liên hệ
const findAllContact = asyncHandler(async(req, res) => {
    const response = await ContactService.findAllContact();
    if(!response){
        return res.status(400).json({
            success: false,
            data: 'Không tìm thấy liên hệ'
        });
    }
    return res.status(200).json({
        success: true,
        data: response
    });
});
// Xóa liên hệ
const deleteContact = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    const response = await ContactService.deleteContact(cid);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa liên hệ thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa liên hệ thành công'
    });
});
// Xóa nhiều liên hệ
const deleteContacts = asyncHandler(async(req, res) => {
    const {contactsId} = req.body;
    const response = await ContactService.deleteContacts(contactsId);
    if(!response){
        return res.status(400).json({
            success: false,
            message: 'Xóa liên hệ thất bại'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Xóa liên hệ thành công'
    });
});
module.exports = {
    addContact,
    sendMailContact,
    findContactById,
    findAllContact,
    deleteContact,
    deleteContacts
}

