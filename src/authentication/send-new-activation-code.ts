import {Request, Response} from "express";
import Joi from "joi";
import {findUser} from "../../utils/find-user";

export const sendNewActivationCode = async (req: Request, res: Response) => {
    const activationEmailSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 }).required()
    });

    const result = await activationEmailSchema.validate(req.body);

    if (result.error) {
        return res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }

    await findUser(req.body.email, res, true);
}