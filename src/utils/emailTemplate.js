const templateMailAuth = ({title, name, type, url}) => {
    return email = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{Xác Thực Tài Khoản}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                    }
                    
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .header h1 {
                        font-size: 28px;
                        margin-bottom: 10px;
                        font-weight: 300;
                    }
                    
                    .header p {
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    
                    .content {
                        padding: 40px 30px;
                    }
                    
                    .welcome-text {
                        font-size: 18px;
                        margin-bottom: 20px;
                        color: #2c3e50;
                    }
                    
                    .description {
                        font-size: 16px;
                        margin-bottom: 30px;
                        color: #555;
                        line-height: 1.8;
                    }
                    
                    .verification-code {
                        background: #f8f9fa;
                        border: 2px dashed #667eea;
                        border-radius: 10px;
                        padding: 25px;
                        text-align: center;
                        margin: 30px 0;
                    }
                    
                    .code-label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .code {
                        font-size: 32px;
                        font-weight: bold;
                        color: #667eea;
                        letter-spacing: 5px;
                        font-family: 'Courier New', monospace;
                    }
                    
                    .verify-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 50px;
                        font-size: 16px;
                        font-weight: 600;
                        text-align: center;
                        margin: 20px 0;
                        transition: transform 0.2s ease;
                    }
                    
                    .verify-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                    }
                    
                    .button-container {
                        text-align: center;
                        margin: 30px 0;
                    }
                    
                    .warning {
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 30px 0;
                    }
                    
                    .warning-icon {
                        color: #f39c12;
                        font-size: 20px;
                        margin-right: 10px;
                    }
                    
                    .warning-text {
                        color: #856404;
                        font-size: 14px;
                    }
                    
                    .footer {
                        background: #2c3e50;
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .footer p {
                        margin-bottom: 10px;
                        opacity: 0.8;
                    }
                    
                    .footer a {
                        color: #667eea;
                        text-decoration: none;
                    }
                    
                    .social-links {
                        margin-top: 20px;
                    }
                    
                    .social-link {
                        display: inline-block;
                        margin: 0 10px;
                        width: 40px;
                        height: 40px;
                        background: #667eea;
                        border-radius: 50%;
                        line-height: 40px;
                        text-align: center;
                        color: white;
                        text-decoration: none;
                        transition: background 0.3s ease;
                    }
                    
                    .social-link:hover {
                        background: #764ba2;
                    }
                    
                    @media (max-width: 600px) {
                        .email-container {
                            margin: 10px;
                        }
                        
                        .header, .content, .footer {
                            padding: 20px;
                        }
                        
                        .header h1 {
                            font-size: 24px;
                        }
                        
                        .code {
                            font-size: 24px;
                            letter-spacing: 3px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <!-- Header -->
                    <div class="header">
                        <h1>${title}</h1>
                        <p>Chào mừng bạn đến với hệ thống của chúng tôi</p>
                    </div>
                    
                    <!-- Content -->
                    <div class="content">
                        <div class="welcome-text">
                            Xin chào <strong>${name}</strong>,
                        </div>
                        
                        <div class="description">
                            ${type === 'register' ? 'Cảm ơn bạn đã đăng ký tài khoản với chúng tôi! Để hoàn tất quá trình đăng ký và bảo mật tài khoản của bạn, vui lòng xác thực địa chỉ email bằng cách sử dụng mã xác thực bên dưới' : 'Cảm ơn bạn đã đăng ký tài khoản với chúng tôi! Để hoàn tất quá trình lấy lại mật khẩu và bảo mật tài khoản của bạn, vui lòng xác thực địa chỉ email bằng cách sử dụng mã xác thực bên dưới'}
                        </div>
                        
                        <!-- Verification Code -->
                        <div class="verification-code">
                            <div class="code-label">Mã Xác Thực</div>
                            <div class="code">[MÃ XÁC THỰC]</div>
                        </div>
                        
                        <!-- Verify Button -->
                        <div class="button-container">
                            <a href="${url}" class="verify-button">Xác Thực Ngay</a>
                        </div>
                        
                        <!-- Warning -->
                        <div class="warning">
                            <span class="warning-icon">⚠️</span>
                            <div class="warning-text">
                                <strong>Lưu ý quan trọng:</strong><br>
                                • Mã xác thực này chỉ có hiệu lực trong <strong>15 phút</strong><br>
                                • Không chia sẻ mã này với bất kỳ ai<br>
                                • Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email
                            </div>
                        </div>
                        
                        <div class="description">
                            Nếu bạn gặp khó khăn khi nhấp vào nút xác thực, vui lòng sao chép và dán liên kết sau vào trình duyệt của bạn:<br>
                            <strong>${url}</strong>
                        </div>
                        
                        <div class="description">
                            Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer">
                        <p><strong>Rynan Smart Agicuture</strong></p>
                        <p>Khu CN Long Đức, xã Long Đức, Thành Phố Trà Vinh, tỉnh Trà Vinh</p>
                        <p>Email: <a href="mailto:info@rynan.vn">info@rynan.vn</a></p>
                        <p>Điện thoại: +84 2943 746 991</p>
                        
                        <div class="social-links">
                            <a href="[FACEBOOK_LINK]" class="social-link">f</a>
                            <a href="[TWITTER_LINK]" class="social-link">t</a>
                            <a href="[INSTAGRAM_LINK]" class="social-link">i</a>
                        </div>
                        
                        <p style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
                            © 2025 Rynan Smart Agicuture. Tất cả quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
}


module.exports = {templateMailAuth};