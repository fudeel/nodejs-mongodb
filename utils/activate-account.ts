import {sendEmail} from "./mailer";

interface ActivationCode {
    error?: boolean,
    message?: string,
    code: number | null,
    expiry: Date | null
}

export const generateNewActivationCode = async (email: string): Promise<ActivationCode> => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms
    const sendVerificationLink = await sendEmail(email, code, "activate");

    if (sendVerificationLink.error) {

        const error: ActivationCode = {
            error: true,
            message: "Couldn't send verification email.",
            code: null,
            expiry: null
        };
        console.log(`Error in sendind the activation code to ${email}: `, error);
        return error;
    } else {
        const activationCode: ActivationCode = {
            error: false,
            message: `Email sent successfully to ${email}`,
            code: code,
            expiry: new Date(expiry)
        };

        console.log(`Activation code was successfully sent to ${email}: `, activationCode);
        return activationCode;
    }
}
