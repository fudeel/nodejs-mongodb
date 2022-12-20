import Joi, {string} from "joi";
import {decodeToken} from "../../utils/decode-token";
import {findUser} from "../../utils/find-user";
import {Request, Response} from "express";


export const checkUserActivation = async (req: Request, res: Response) => {
    if (req.headers['idtoken'] && req.headers['idtoken'] === typeof string) {
        const decodedEmail = await decodeToken(req.headers['idtoken']);

        if (!decodedEmail) {
            return res.status(400).json({
                error: true,
                message: "Email empty or not valid format",
            });
        }

        const user = await findUser(decodedEmail, res, false);

        res.status(200).send({
            status: 200,
            error: false,
            user: user
        })
    }


    const activationSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 })
    });

    const result = await activationSchema.validate(req.body);

    if (result.error) {
        return res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }

}
