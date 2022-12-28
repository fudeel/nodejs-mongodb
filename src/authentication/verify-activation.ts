import {Request, Response} from "express";
import Joi, {string} from "joi";
import {decodeFirebaseToken} from "../../utils/decode-firebase-token";
import {findUser} from "../../utils/find-user";
import {CustomResponse} from "../../models/CustomResponse";

export const checkUserActivation = async (req: any, res: Response) => {
    console.log('>  Checking user activation...');
    console.log('>  Checking mongodb token...: ', req.decoded);
    console.log('>  Checking firebase token...', req.firebaseDecoded);
    if (req.headers['idtoken'] && req.headers['idtoken'] === typeof string) {

        const customResponse: CustomResponse = {
            error: true,
            success: true,
            status: 200,
            forceLogout: false,
        }
        return res.status(200).send(customResponse);
    }


    const activationSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 })
    });

    const result = await activationSchema.validate(req.body);

    if (result.error) {
        const customResponse: CustomResponse = {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
        return res.status(500).send(customResponse);
    }

}