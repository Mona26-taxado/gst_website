require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Email templates
const adminEmailTemplate = (data, inlineImages, files) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Application Received</title>
</head>
<body style="margin:0; padding:0; background:#f8f6f2; font-family: Arial, sans-serif;">
    <table width="100%" bgcolor="#f8f6f2" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 4px 24px rgba(255,152,0,0.10);">
                    <tr>
                        <td style="background: linear-gradient(90deg,rgb(0, 30, 255) 0%,rgb(34, 45, 255) 100%); padding:32px 0; border-radius:12px 12px 0 0;" align="center">
                            <h1 style="color:#fff; margin:0; font-size:2rem;">New Application Received</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 40px 24px 40px;">
                            <div style="background:#fff3e0; border-left:4px solid #ff9800; padding:18px 20px; border-radius:8px; margin-bottom:24px;">
                                <p style="color:#ff9800; font-size:1.1rem; margin:0;">
                                    <b>New Application Details</b><br>
                                    A new application has been submitted through the website.
                                </p>
                            </div>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #eee;">
                                        <span style="color:#666; font-weight:600;">Full Name:</span>
                                        <span style="color:#222; float:right;">${data.fullName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #eee;">
                                        <span style="color:#666; font-weight:600;">Mobile Number:</span>
                                        <span style="color:#222; float:right;">${data.mobileNumber}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #eee;">
                                        <span style="color:#666; font-weight:600;">Email:</span>
                                        <span style="color:#222; float:right;">${data.email}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #eee;">
                                        <span style="color:#666; font-weight:600;">Address:</span>
                                        <span style="color:#222; float:right;">${data.address}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;">
                                        <span style="color:#666; font-weight:600;">Interested In:</span>
                                        <span style="color:#222; float:right;">${data.interestType}</span>
                                    </td>
                                </tr>
                            </table>
                            <h3>Attached Documents</h3>
                            <ul>
                                ${files.aadharFront && files.aadharFront[0] ? `
                                    <li>
                                        Aadhar Card (Front):<br>
                                        ${files.aadharFront[0].mimetype.startsWith('image/') ?
                                            `<img src="cid:${inlineImages.aadharFront}" style="max-width:200px; border:1px solid #ccc; border-radius:8px;">`
                                            :
                                            `<a href="cid:${inlineImages.aadharFront}">Download Aadhar Front</a>`
                                        }
                                    </li>` : ''}
                                ${files.aadharBack && files.aadharBack[0] ? `
                                    <li>
                                        Aadhar Card (Back):<br>
                                        ${files.aadharBack[0].mimetype.startsWith('image/') ?
                                            `<img src="cid:${inlineImages.aadharBack}" style="max-width:200px; border:1px solid #ccc; border-radius:8px;">`
                                            :
                                            `<a href="cid:${inlineImages.aadharBack}">Download Aadhar Back</a>`
                                        }
                                    </li>` : ''}
                                ${files.panCard && files.panCard[0] ? `
                                    <li>
                                        PAN Card:<br>
                                        ${files.panCard[0].mimetype.startsWith('image/') ?
                                            `<img src="cid:${inlineImages.panCard}" style="max-width:200px; border:1px solid #ccc; border-radius:8px;">`
                                            :
                                            `<a href="cid:${inlineImages.panCard}">Download PAN Card</a>`
                                        }
                                    </li>` : ''}
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const userEmailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Application Received</title>
</head>
<body style="margin:0; padding:0; background:#f8f6f2;">
    <table width="100%" bgcolor="#f8f6f2" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 4px 24px rgba(255,152,0,0.10); margin:40px 0;">
                    <tr>
                        <td style="background: linear-gradient(90deg, #ff9800 0%, #ff5722 100%); padding:32px 0; border-radius:12px 12px 0 0;" align="center">
                            <h1 style="color:#fff; margin:0; font-size:2rem;">Application Received!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 40px 24px 40px;">
                            <h2 style="color:#d35400; margin-top:0;">Dear ${data.fullName},</h2>
                            <p style="color:#444; font-size:1.1rem;">
                                Thank you for applying to <b>Grahak Sahaayata Kendra</b>.<br>
                                We have received your application and our team will review it shortly.
                            </p>
                            <div style="background:#fff3e0; border-left:4px solid #ff9800; padding:18px 20px; border-radius:8px; margin:24px 0;">
                                <p style="color:#ff9800; font-size:1.1rem; margin:0;">
                                    <b>What happens next?</b><br>
                                    Our executive will contact you soon regarding the next steps.
                                </p>
                            </div>
                            <p style="color:#444; font-size:1rem;">
                                For immediate assistance, call us at <a href="tel:+917318147230" style="color:#ff9800; text-decoration:none;">+91 7318147230</a>
                            </p>
                            <p style="color:#444; font-size:1rem;">
                <b>Your Application Details:</b><br>
                Name: ${data.fullName}<br>
                Mobile: ${data.mobileNumber}<br>
                Email: ${data.email}<br>
                Address: ${data.address}<br>
                Interested In: ${data.interestType}
              </p>
                            <div style="text-align:center; margin:32px 0;">
                <a href="https://grahaksahaayatakendra.in" style="background:linear-gradient(90deg,#ff9800 0%,#ff5722 100%); color:#fff; padding:14px 32px; border-radius:30px; text-decoration:none; font-weight:600; font-size:1.1rem;">Visit Our Website</a>
              </div>
              <p style="color:#888; font-size:0.95rem; text-align:center;">
                This is an automated message from Grahak Sahaayata Kendra.<br>
                &copy; 2025 Grahak Sahaayata Kendra. All rights reserved.
              </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Handle form submission
app.post('/submit-application', upload.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'panCard', maxCount: 1 }
]), async (req, res) => {
    try {
        const { fullName, mobileNumber, email, address, interestType } = req.body;
        const files = req.files;
        console.log('FILES RECEIVED:', files); // Debug: log all received files

        // Build attachments and inlineImages for admin email
        const attachments = [];
        const inlineImages = {};
        if (files.aadharFront && files.aadharFront[0]) {
            attachments.push({
                filename: files.aadharFront[0].originalname,
                path: files.aadharFront[0].path,
                cid: 'aadharFront'
            });
            inlineImages.aadharFront = 'aadharFront';
        }
        if (files.aadharBack && files.aadharBack[0]) {
            attachments.push({
                filename: files.aadharBack[0].originalname,
                path: files.aadharBack[0].path,
                cid: 'aadharBack'
            });
            inlineImages.aadharBack = 'aadharBack';
        }
        if (files.panCard && files.panCard[0]) {
            attachments.push({
                filename: files.panCard[0].originalname,
                path: files.panCard[0].path,
                cid: 'panCard'
            });
            inlineImages.panCard = 'panCard';
        }

        // Send email to admin
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: [process.env.ADMIN_EMAIL],
            cc: ['naveeng123gupta@gmail.com'],
            subject: "New Application from Grahak Sahaayata Kendra Website",
            html: adminEmailTemplate(req.body, inlineImages, files),
            attachments: attachments
        });

        // Send confirmation email to user
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Thank you for applying to Grahak Sahaayata Kendra",
            html: userEmailTemplate(req.body)
        });

        res.json({ success: true, message: 'Application submitted successfully! Please check your email for confirmation.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your application.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 