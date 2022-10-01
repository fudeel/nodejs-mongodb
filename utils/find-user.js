import {User} from "../schemas/user-schema.js";
import {generateNewActivationCode} from "./activate-account.js";

export const findUser = async (email, res, generateCode) => {
    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "Account not found",
        });
    }

    //2. Throw error if account is not activated
    if (!user.active) {
        if (generateCode) {
            const activateEmail = await generateNewActivationCode(user.email);
            user.emailToken = activateEmail.code;
            user.emailTokenExpires = new Date(activateEmail.expiry);
            await user.save();
        }

        return res.status(401).json({
            error: true,
            message: `You must verify your email to activate your account.`,
            activationError: true,
            email: user.email
        });
    }

    return user;
}
