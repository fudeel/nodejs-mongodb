"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.GMAIL_SMTP_HOST,
    port: process.env.GMAIL_SMTP_PORT,
    auth: {
        user: process.env.GMAIL_SMTP_AUTH_USER,
        pass: process.env.GMAIL_SMTP_AUTH_PASSWORD,
    }
});
transporter.verify().then().catch(console.error);
function sendEmail(email, code, action, link) {
    return __awaiter(this, void 0, void 0, function* () {
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
                html: action === "activate" ? activation_body : action === "reset" ? new_password_body : undefined
            }).then().catch(error => {
                console.log('There was an error sending the email: ', error);
            });
            return { error: false };
        }
        catch (error) {
            console.error("send-email-error", error);
            return {
                error: true,
                message: "Cannot send email",
            };
        }
    });
}
exports.sendEmail = sendEmail;
