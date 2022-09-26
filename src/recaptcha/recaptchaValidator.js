import Joi from "joi";
import {recaptchaVerification} from "../../utils/recaptcha-verification.js";

const recaptchaSchema = Joi.object().keys({
    recaptchaKey: Joi.string().required()
});

export const validateRecaptchaV2 = async (req, res) => {
    try {
        const recaptcha = await recaptchaSchema.validate(req.body);
        if (recaptcha.error) {
            return await res.status(500).json({
                error: true,
                message: recaptcha.error.message.toString()
            })
        }

        const validator = await recaptchaVerification(req.body.recaptchaKey, 'v2');

        return res.status(400).json(validator)
    } catch (e) {
        console.log('V2 Error: ', e);
    }
}


export const validateRecaptchaV3 = async (req, res) => {
    try {
        const recaptcha = await recaptchaSchema.validate(req.body);
        if (recaptcha.error) {
            return await res.status(500).json({
                error: true,
                message: recaptcha.error.message.toString()
            })
        }

        const validator = await recaptchaVerification(req.body.recaptchaKey, 'v3');

        return res.status(400).json(validator)
    } catch (e) {
        console.log('V2 Error: ', e);
    }
}
