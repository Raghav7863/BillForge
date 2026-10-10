import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email:any, otp:any) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your email</h2>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>If you didn't request this code, you can ignore this email.</p>
      </div>
    `,
  });
}

export default transporter;