import {sendEmail} from "../../utils/mailer.js";

export const generateNewActivationCode = async (email, res) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms
    const sendVerificationLink = await sendEmail(email, code, "activate");

    if (sendVerificationLink.error) {
        return res.status(500).json({
            error: true,
            message: "Couldn't send verification email.",
            code: null,
            expiry: null
        });
    } else {
        return {
            error: false,
            message: `Email sent successfully to ${email}`,
            code: code,
            expiry: expiry
        }
    }
}
