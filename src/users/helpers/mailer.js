require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_SMTP_HOST,
  port: process.env.GMAIL_SMTP_PORT,
  auth: {
    user: process.env.GMAIL_SMTP_AUTH_USER,
    pass: process.env.GMAIL_SMTP_AUTH_PASSWORD,
  },
});
transporter.verify().then().catch(console.error);

async function sendEmail(email, code, action, link) {

  const activation_body = `<!DOCTYPE> 
    <html>
    <style>
    p.bolder {
        font-weight: bolder;
    }
</style>
      <body>
        <p>The activation code for ${email} is: </p> 
        <p class="bolder">${code}</p>
      </body>
    </html>`;

  const new_password_body = `<!DOCTYPE> 
    <html>
      <body>
      <p>Click the link below to reset your password</p>
      <a href="${link}">${link}</a>
      <p>If you did not request a password change, ignore this email.</p>
    </html>`;

  try {
    transporter.sendMail({
      from: process.env.PROJECT_NAME,
      to: email,
      subject: action === "activate" ? "Complete your registration" : action === "reset" ? "Password reset" : "ok",
      html: action === "activate" ? activation_body : action === "reset" ? new_password_body : null
    }).then(info => {
      console.log({info});
    }).catch(console.error);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

module.exports = { sendEmail };
