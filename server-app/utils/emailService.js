const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Secure SSL
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// exports.sendResetEmail = async (email, token) => {
//   try {
//     const resetLink = `${process.env.FRONTEND_URL}/change-password?token=${token}`;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Change Request",
//       html: `<p>You requested a password change. Click the link below to change your password:</p>
//                <a href="${resetLink}">${resetLink}</a>
//                <p>If you did not request this, please ignore this email.</p>`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent:", info.response);
//   } catch (error) {
//     console.error("❌ Email sending failed:", error.message);
//   }

// };
exports.sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code for Password Reset",
    html: `<p>Your One-Time Password (OTP) for resetting your password is:</p>
             <h2>${otp}</h2>
             <p>This OTP is valid for 10 minutes.</p>
             <p>If you did not request this, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
