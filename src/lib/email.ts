import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailFromName = process.env.EMAIL_FROM_NAME ?? "Bhavnagar Store";

export function getTransporter() {
  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in environment for email delivery.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

export async function sendOTPEmail(to: string, otp: string) {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"${emailFromName}" <${emailUser}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });
}
