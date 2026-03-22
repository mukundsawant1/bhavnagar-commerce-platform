import nodemailer from "nodemailer";

const emailFromName = process.env.EMAIL_FROM_NAME ?? "Bhavnagar Store";
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS ?? "bhavnagarstore@gmail.com";

export function getTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

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
    from: `"${emailFromName}" <${emailFromAddress}>`,
    to,
    subject: "Bhavnagar Store OTP: Access your account",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; padding: 24px; background: #f8fafc;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
          <div style="background: linear-gradient(90deg, #0f766e 0%, #134e4a 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">Bhavnagar Store</h1>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.94;">Secure OTP login</p>
          </div>

          <div style="padding: 24px;">
            <p style="margin: 0; font-size: 16px;">Hello,</p>
            <p style="font-size: 14px; color: #334155;">Use the 6-digit code below to sign in or sign up in the Bhavnagar bulk-order app. This code expires in 5 minutes.</p>
            <div style="margin: 24px 0; padding: 18px 20px; border-radius: 10px; background: #e2f7f2; text-align: center;"> 
              <span style="font-size: 32px; letter-spacing: 0.14em; font-weight: 700; color: #0f766e;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #64748b;">If you did not request this code, please ignore this email.</p>
            <p style="font-size: 12px; color: #64748b; margin: 0;">Signed, <strong>Bhavnagar Store Team</strong></p>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0;" />

          <div style="padding: 14px 24px; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0;">Need help? Visit <a href="https://localhost:3000" style="color: #0f766e; text-decoration: none;">Bhavnagar Store</a>.</p>
          </div>
        </div>
      </div>
    `,
  });
}
