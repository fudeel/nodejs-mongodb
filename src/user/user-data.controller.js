import Joi from "joi";
import {User} from "../../schemas/user-schema.js";
import {decodeToken} from "../../utils/decode-token.js";


export const checkUserActivation = async (req, res) => {

    const decodedEmail = await decodeToken(req.headers['idtoken']);

    console.log('EMAIL: ', decodedEmail);

    const activationSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 })
    });

    console.log("Let's check if the user is authenticated correctly and active");
    const result = await activationSchema.validate(req.body);

    if (result.error) {
        return await res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }


    if (!decodedEmail) {
        return res.status(400).json({
            error: true,
            message: "Email empty or not valid format",
        });
    }

    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: decodedEmail });

    // NOT FOUND - Throw error
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "Account not found",
        });
    }

    //2. Throw error if account is not activated
    if (!user.active) {
        console.log('Current user is not active');
        return false;
    } else {
        console.log('User is active');
        return res.send({
            success: true,
            message: 'user is active'
        });
    }

}
