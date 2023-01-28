"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "fadilmucia@gmail.com",
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
        <p>The password reset code is: </p> 
        <p class="bolder">${code}</p>
      <p>If you did not request a password change, ignore this email.</p>
    </html>`;
        try {
            transporter.sendMail({
                from: "<fadilmucia@gmail.com>",
                to: "<" + email + ">",
                subject: action === "activate" ? "Complete your registration" : "Password reset",
                html: action === "activate" ? activation_body : new_password_body
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
//# sourceMappingURL=mailer.js.map