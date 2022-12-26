import {Request, Response} from "express";
import {User} from "../../schemas/user-schema";
import {CustomResponse} from "../../models/CustomResponse";

export const Activate = async (req: Request, res: Response) => {
    console.log('>  Activating user with email: ', req.body['email']);
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            const customResponse: CustomResponse = {
                error: true,
                status: 400,
                message: "Please make a valid request",
            }
            return res.status(400).send(customResponse);
        }
        const user = await User.findOne({
            email: email,
            emailToken: code,
            emailTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            console.log(`X  Activation error: user with email ${email} not found.`)
            const customResponse: CustomResponse = {
                error: true,
                message: "The code is not valid",
                status: 400
            }
            return res.status(400).send(customResponse);
        } else {
            if (user.active) {
                console.log(`X  Activation error: user with email ${email} is already active`)
                const customResponse: CustomResponse = {
                    error: true,
                    message: "Account already activated",
                    status: 400,
                }
                return res.status(400).send(customResponse);
            } else {
                user.emailToken = null;
                user.emailTokenExpires = null;
                user.active = true;

                await user.save();

                console.log(`>  Activation success: user with email ${email} is now active`);
                const customResponse: CustomResponse = {
                    success: true,
                    message: "Account activated.",
                    status: 200,
                }
                return res.status(200).send(customResponse);
            }
        }
    } catch (error: any) {
        console.error("activation-error: ", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};