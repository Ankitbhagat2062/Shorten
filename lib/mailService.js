import { html } from "./constants";
import nodemailer  from 'nodemailer'

export async function sendMail(subject, toEmail, otpText) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_SECRET,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject,
    text: otpText,
    html: html(otpText, toEmail), // Optional: HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.response);
    const failed = info.rejected.concat(info.pending).filter(Boolean);
    if (failed.length) {
      return { error: true, message: `Email(s) (${failed.join(", ")}) could not be sent`, success: false };
    }
    return { message: 'Email sent successfully', success: true, error: false, response: info.response };
  } catch (error) {
    console.error("Email Error:", error);
    return { error: true, message: `Email could not be sent ${error.message}`, success: false };
  }
}
