import {Response} from "express";
import {User} from "../../schemas/user-schema";
import {CustomResponse} from "../../models/CustomResponse";

export const Logout = async (req: any, res: Response) => {
    try {
        const { id } = req.decoded;

        const user = await User.findOne({ userId: id });

        if (user) {
            user.accessToken = null;
            await user.save();
            const customResponse: CustomResponse = {
                error: false,
                success: true,
                message: 'User logged out',
                status: 200,
                forceLogout: false
            }
            return res.status(200).send(customResponse);
        } else {
            const customResponse: CustomResponse = {
                error: true,
                message: 'Not authorized',
                status: 401,
                forceLogout: false
            }
            return res.status(401).send(customResponse);
        }
    } catch (error: any) {
        console.error("user-logout-error", error);
        const customResponse: CustomResponse = {
            error: true,
            message: error.message,
            status: 500,
            forceLogout: false
        }
        return res.status(500).send(customResponse);
    }
};