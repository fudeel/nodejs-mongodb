import nodemailer, {Transport, TransportOptions} from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "fadilmucia@gmail.com",
        pass: process.env.GMAIL_SMTP_AUTH_PASSWORD,
    }
} as TransportOptions | Transport<unknown>);
transporter.verify().then().catch(console.error);

export async function sendEmail(email: string, code: number, action: "activate" | "reset", link?: string) {

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
    } catch (error) {
        console.error("send-email-error", error);
        return {
            error: true,
            message: "Cannot send email",
        };
    }


}
