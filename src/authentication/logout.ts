import {Response} from "express";
import {User} from "../../schemas/user-schema";

export const Logout = async (req: any, res: Response) => {
    try {
        const { id } = req.decoded;

        const user = await User.findOne({ userId: id });

        if (user) {
            user.accessToken = null;
            await user.save();
            return res.send({ success: true, message: "User Logged out" });
        } else {
            return res.status(401).send({
                error: true,

            })
        }
    } catch (error: any) {
        console.error("user-logout-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};