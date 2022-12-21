import nodemailer, {Transport, Transporter, TransportOptions} from 'nodemailer';

let transporter: Transporter;
export function createTransporter () {
    const t: Transporter = nodemailer.createTransport({
        host: process.env.MAILGUN_SMTP_HOSTNAME,
        port: process.env.MAILGUN_PORT,
        secure: false,
        auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD,
        }
    } as TransportOptions | Transport<unknown>);
    t.verify().then().catch(console.error);

    transporter = t;
}

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
    } catch (error) {
        console.error("send-email-error", error);
        return {
            error: true,
            message: "Cannot send email",
        };
    }
}
