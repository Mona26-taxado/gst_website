<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer classes
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = $_POST['fullName'] ?? '';
    $mobileNumber = $_POST['mobileNumber'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $interestType = $_POST['interestType'] ?? '';

    // File uploads
    $uploads = [];
    $fields = [
        'aadharFront' => 'Aadhar_Front',
        'aadharBack' => 'Aadhar_Back',
        'panCard' => 'PAN_Card'
    ];
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    foreach ($fields as $field => $label) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES[$field]['tmp_name'];
            $fileName = $label . '_' . time() . '_' . basename($_FILES[$field]['name']);
            $targetPath = $uploadDir . $fileName;
            if (move_uploaded_file($tmpName, $targetPath)) {
                $uploads[$field] = $targetPath;
            }
        }
    }

    $mail = new PHPMailer(true);
    try {
        // SMTP config
        $mail->isSMTP();
        $mail->Host = 'smtpout.secureserver.net';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@grahaksahaayatakendra.com';
        $mail->Password = 'SAHAAYATA@123'; // The password you use for this email
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // For port 465
        $mail->Port = 465; // Use 465 for SSL, or 587 for TLS (with PHPMailer::ENCRYPTION_STARTTLS)

        // Admin email
        $mail->setFrom('info@grahaksahaayatakendra.com', 'Grahak Sahaayata Kendra');
        $mail->addAddress('arjunmoto26@gmail.com');
        $mail->isHTML(true);
        $mail->Subject = "New Application from Grahak Sahaayata Kendra Website";
        $mail->Body = '
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
            <td style="background: linear-gradient(90deg, #ff9800 0%, #ff5722 100%); padding:32px 0; border-radius:12px 12px 0 0;" align="center">
              <img src="GSK-Logo.png" alt="Grahak Sahaayata Kendra" width="80" style="margin-bottom:12px;">
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
                    <span style="color:#222; float:right;">' . htmlspecialchars($fullName) . '</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eee;">
                    <span style="color:#666; font-weight:600;">Mobile Number:</span>
                    <span style="color:#222; float:right;">' . htmlspecialchars($mobileNumber) . '</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eee;">
                    <span style="color:#666; font-weight:600;">Email:</span>
                    <span style="color:#222; float:right;">' . htmlspecialchars($email) . '</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #eee;">
                    <span style="color:#666; font-weight:600;">Address:</span>
                    <span style="color:#222; float:right;">' . htmlspecialchars($address) . '</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="color:#666; font-weight:600;">Interested In:</span>
                    <span style="color:#222; float:right;">' . htmlspecialchars($interestType) . '</span>
                  </td>
                </tr>
              </table>
              <div style="background:#f8f6f2; padding:20px; border-radius:8px; margin-bottom:24px;">
                <h3 style="color:#ff9800; margin-top:0;">Attached Documents</h3>
                <ul style="color:#444; margin:0; padding-left:20px;">
                  ' . (isset($uploads['aadharFront']) ? '<li>Aadhar Card (Front)</li>' : '') . '
                  ' . (isset($uploads['aadharBack']) ? '<li>Aadhar Card (Back)</li>' : '') . '
                  ' . (isset($uploads['panCard']) ? '<li>PAN Card</li>' : '') . '
                </ul>
              </div>
              <div style="text-align:center;">
                <a href="https://grahaksahaayatakendra.com/" style="background:linear-gradient(90deg,#ff9800 0%,#ff5722 100%); color:#fff; padding:14px 32px; border-radius:30px; text-decoration:none; font-weight:600; font-size:1.1rem; display:inline-block;">View in Admin Panel</a>
              </div>
              <p style="color:#888; font-size:0.95rem; text-align:center; margin-top:32px;">
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
';
        // Attach files
        foreach ($uploads as $file) {
            $mail->addAttachment($file);
        }
        $mail->send();

        // Confirmation to user
        $mail->clearAddresses();
        $mail->clearAttachments();
        $mail->addAddress($email);
        $mail->Subject = "Thank you for applying to Grahak Sahaayata Kendra";
        $mail->Body = '
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
              <img src="GSK-Logo.png" alt="Grahak Sahaayata Kendra" width="80" style="margin-bottom:12px;">
              <h1 style="color:#fff; margin:0; font-size:2rem;">Application Received!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 24px 40px;">
              <h2 style="color:#d35400; margin-top:0;">Dear ' . htmlspecialchars($fullName) . ',</h2>
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
                Name: ' . htmlspecialchars($fullName) . '<br>
                Mobile: ' . htmlspecialchars($mobileNumber) . '<br>
                Email: ' . htmlspecialchars($email) . '<br>
                Address: ' . htmlspecialchars($address) . '<br>
                Interested In: ' . htmlspecialchars($interestType) . '
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
';
        $mail->send();

        echo json_encode(['success' => true, 'message' => 'Application submitted successfully! Please check your email for confirmation.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
    }
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>