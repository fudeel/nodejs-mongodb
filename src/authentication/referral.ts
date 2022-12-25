import {Response} from "express";
import {User} from "../../schemas/user-schema";

export const ReferredAccounts = async (req: any, res: Response) => {
    try {
        const {referralCode } = req.decoded;

        const referredAccounts = await User.find(
            { referrer: referralCode },
            { email: 1, referralCode: 1, _id: 0 }
        );
        return res.send({
            success: true,
            accounts: referredAccounts,
            total: referredAccounts.length,
        });
    } catch (error: any) {
        console.error("fetch-referred-error: ", error);
    }
};