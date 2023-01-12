import {User} from "../schemas/user-schema";
import {generateNewActivationCode} from "./activate-account";
import {CustomResponse} from "../models/CustomResponse";

export const findUser = async (email: string, res: Response | any, generateCode: boolean) => {
    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
        return res.status(404).json(<CustomResponse>{
            error: true,
            message: "Incorrect email/password or account not found",
            forceLogout: true,
            status: 404
        });
    }

    //2. Throw error if account is not activated
    if (!user.active) {
        if (generateCode) {
            const activateEmail = await generateNewActivationCode(user.email);
            user.emailToken = activateEmail.code;
            user.emailTokenExpires = activateEmail.expiry;
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
