import {Request, Response} from "express";
import {User} from "../../schemas/user-schema";

export const Activate = async (req: Request, res: Response) => {
    console.log('>  Activating user with email: ', req.body['email']);
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.json({
                error: true,
                status: 400,
                message: "Please make a valid request",
            });
        }
        const user = await User.findOne({
            email: email,
            emailToken: code,
            emailTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            console.log(`X  Activation error: user with email ${email} not found.`)
            return res.status(200).json({
                error: true,
                message: "The code is not valid",
            });
        } else {
            if (user.active) {
                console.log(`X  Activation error: user with email ${email} is already active`)
                return res.send({
                    error: true,
                    message: "Account already activated",
                    status: 400,
                });
            } else {
                user.emailToken = null;
                user.emailTokenExpires = null;
                user.active = true;

                await user.save();

                console.log(`>  Activation success: user with email ${email} is now active`);
                return res.status(200).json({
                    success: true,
                    message: "Account activated.",
                });
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