import axios from "axios";
import {Response} from "express";
import {CustomResponse} from "../models/CustomResponse";

export const recaptchaVerification = async (req: any, res: Response, next: () => void) => {
    console.log('>  waiting for recaptcha verification \n');
    try {
        await axios
            .post(`https://www.google.com/recaptcha/api/siteverify?secret=${req.body.version === 'v2' ?
                process.env.GOOGLE_RECAPTCHA_V2_SECRET_KEY : process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY}&response=${req.body.recaptchaKey}`, {}, {})
            .then(async (res) => {
                if (res.data.success) {
                    console.log('> recaptcha verification ok')
                    console.table(res.data);
                    next();
                } else {
                    throw<CustomResponse> {
                        error: true,
                        message: 'Error in accepting the ReCaptcha code. Are you a bot?',
                        status: 401,
                        forceLogout: true
                    }
                }

            }).catch(() => {
               throw<CustomResponse> {
                   error: true,
                   message: 'Error in accepting the ReCaptcha code. Are you a bot?',
                   status: 401,
                   forceLogout: true
               }
            });
    } catch (err) {
        res.status(err.status).send(err)
    }

}
