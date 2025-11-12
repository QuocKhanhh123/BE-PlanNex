const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dariusishaffero@gmail.com',
        pass: 'qiui bmij ghvk lrvu'
    }
});

async function sendEmail({ to, subject, html }) {
    try {
        await transporter.sendMail({
            from: '"PlanNex" <dariusishaffero@gmail.com>',
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

module.exports = {
    sendEmail,
    getWorkspaceInvitationEmailTemplate,
    getTaskAssignedEmailTemplate,
    getInvitationResponseEmailTemplate
};
