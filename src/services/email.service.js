const nodemailer = require('nodemailer');

const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
const OTP_EXPIRES_MINUTES = parseInt(process.env.OTP_EXPIRES_MINUTES || '10', 10);


const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_APP_PASSWORD
    }
});

async function sendEmail({ to, subject, html }) {
    try {
        await transporter.sendMail({
            from: `"PlanNex" <${EMAIL_SENDER}>`,
            to,
            subject,
            html
        });
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
}

function getWorkspaceInvitationEmailTemplate(workspace, inviterName, acceptUrl) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
                .button:hover { background: #0056b3; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>🎉 Lời mời tham gia Workspace</h2>
                <p>Xin chào,</p>
                <p><strong>${inviterName}</strong> đã mời bạn tham gia workspace <strong>${workspace.name}</strong> trên PlanNex.</p>
                ${workspace.description ? `<p><em>${workspace.description}</em></p>` : ''}
                <p>
                    <a href="${acceptUrl}" class="button">Chấp nhận lời mời</a>
                </p>
                <p>Hoặc copy link sau vào trình duyệt:<br>${acceptUrl}</p>
                <div class="footer">
                    <p>Email này được gửi từ PlanNex. Nếu bạn không yêu cầu, vui lòng bỏ qua.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function getTaskAssignedEmailTemplate(task, assignerName, taskUrl) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .task-info { background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; }
                .priority { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
                .priority-high { background: #dc3545; color: white; }
                .priority-medium { background: #ffc107; color: #000; }
                .priority-low { background: #17a2b8; color: white; }
                .priority-urgent { background: #ff0000; color: white; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>✅ Bạn được giao nhiệm vụ mới</h2>
                <p><strong>${assignerName}</strong> đã giao nhiệm vụ cho bạn.</p>
                <div class="task-info">
                    <h3>${task.title}</h3>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    <p>
                        <strong>Độ ưu tiên:</strong> 
                        <span class="priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                    </p>
                    ${task.dueDate ? `<p><strong>Hạn hoàn thành:</strong> ${new Date(task.dueDate).toLocaleString('vi-VN')}</p>` : ''}
                </div>
                <p>
                    <a href="${taskUrl}" class="button">Xem chi tiết nhiệm vụ</a>
                </p>
                <div class="footer">
                    <p>Email này được gửi từ PlanNex.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function getInvitationResponseEmailTemplate(workspace, responderName, accepted) {
    const status = accepted ? 'đã chấp nhận' : 'đã từ chối';
    const emoji = accepted ? '✅' : '❌';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .status-box { background: ${accepted ? '#d4edda' : '#f8d7da'}; color: ${accepted ? '#155724' : '#721c24'}; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>${emoji} Phản hồi lời mời workspace</h2>
                <div class="status-box">
                    <p><strong>${responderName}</strong> ${status} lời mời tham gia workspace <strong>${workspace.name}</strong>.</p>
                </div>
                <div class="footer">
                    <p>Email này được gửi từ PlanNex.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function getOTPEmailTemplate(fullName, otp) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 28px; }
                .content { padding: 40px 30px; }
                .otp-box { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; border: 3px solid #667eea; }
                .otp-code { font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
                .otp-label { font-size: 14px; color: #666; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 2px; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e9ecef; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .info-box { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Mã Xác Thực OTP</h1>
                </div>
                <div class="content">
                    <p>Xin chào <strong>${fullName}</strong>,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản PlanNex!</p>
                    <p>Đây là mã OTP để xác thực email của bạn:</p>
                    
                    <div class="otp-box">
                        <div class="otp-label">Mã OTP của bạn</div>
                        <div class="otp-code">${otp}</div>
                    </div>
                    
                    <div class="info-box">
                        <p style="margin: 0;"><strong>📱 Cách sử dụng:</strong></p>
                        <p style="margin: 10px 0 0 0;">Nhập mã OTP này vào trang xác thực để hoàn tất đăng ký tài khoản.</p>
                    </div>
                    
                    <div class="warning">
                        <p><strong>⚠️ Lưu ý quan trọng:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Mã OTP có hiệu lực trong <strong>${OTP_EXPIRES_MINUTES} phút</strong></li>
                            <li>Bạn có <strong>5 lần thử</strong> để nhập đúng mã</li>
                            <li>Không chia sẻ mã này với bất kỳ ai</li>
                            <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>Email này được gửi từ <strong>PlanNex</strong></p>
                    <p>Nếu bạn gặp vấn đề, vui lòng liên hệ support@plannex.com</p>
                    <p style="margin-top: 10px; color: #999;">© 2025 PlanNex. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function getPasswordResetCodeEmailTemplate(fullName, resetCode) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 40px 20px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 28px; }
                .content { padding: 40px 30px; }
                .code-box { background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; border: 3px solid #dc3545; }
                .code { font-size: 48px; font-weight: bold; color: #dc3545; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
                .code-label { font-size: 14px; color: #666; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 2px; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e9ecef; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .info-box { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔑 Mã Đặt Lại Mật Khẩu</h1>
                </div>
                <div class="content">
                    <p>Xin chào <strong>${fullName}</strong>,</p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản PlanNex của bạn.</p>
                    <p>Đây là mã xác nhận để đặt lại mật khẩu:</p>
                    
                    <div class="code-box">
                        <div class="code-label">Mã đặt lại mật khẩu</div>
                        <div class="code">${resetCode}</div>
                    </div>
                    
                    <div class="info-box">
                        <p style="margin: 0;"><strong>📱 Cách sử dụng:</strong></p>
                        <p style="margin: 10px 0 0 0;">Nhập mã này vào trang xác nhận để tiếp tục đặt lại mật khẩu.</p>
                    </div>
                    
                    <div class="warning">
                        <p><strong>⚠️ Lưu ý quan trọng:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Mã có hiệu lực trong <strong>${OTP_EXPIRES_MINUTES} phút</strong></li>
                            <li>Không chia sẻ mã này với bất kỳ ai</li>
                            <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                            <li>Để bảo mật tài khoản, hãy đổi mật khẩu ngay sau khi nhận được email này</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>Email này được gửi từ <strong>PlanNex</strong></p>
                    <p>Nếu bạn gặp vấn đề, vui lòng liên hệ support@plannex.com</p>
                    <p style="margin-top: 10px; color: #999;">© 2025 PlanNex. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

module.exports = {
    sendEmail,
    getWorkspaceInvitationEmailTemplate,
    getTaskAssignedEmailTemplate,
    getInvitationResponseEmailTemplate,
    getOTPEmailTemplate,
    getPasswordResetCodeEmailTemplate
};
