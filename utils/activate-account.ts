import {sendEmail} from "./mailer";
import {ActivationCode} from "../models/ActivationCode";

export const generateNewActivationCode = async (email: string): Promise<ActivationCode> => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const threeHours = 3 * 60 * 60 * 1000;
    const futureTime = new Date(Date.now() + threeHours);
    const sendVerificationLink = await sendEmail(email, code, "activate");

    if (sendVerificationLink.error) {

        const error: ActivationCode = {
            error: true,
            message: "Couldn't send verification email.",
            code: null,
            expiry: null
        };
        return error;
    } else {
        return {
            error: false,
            message: `Email sent successfully to ${email}`,
            code: code,
            expiry: new Date(futureTime)
        };
    }
}
