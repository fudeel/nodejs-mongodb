import {sendEmail} from "./mailer.js";

export const generateNewActivationCode = async (email) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms
    const sendVerificationLink = await sendEmail(email, code, "activate");

    if (sendVerificationLink.error) {

        const error = {
            error: true,
            message: "Couldn't send verification email.",
            code: null,
            expiry: null
        };
        console.log(`Error in sendind the activation code to ${email}: `, error);
        return error;
    } else {
        const activationCode = {
            error: false,
            message: `Email sent successfully to ${email}`,
            code: code,
            expiry: expiry
        };

        console.log(`Activation code was successfully sent to ${email}: `, activationCode);
        return activationCode;
    }
}
