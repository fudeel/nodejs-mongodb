import jwt, {Secret, VerifyOptions} from 'jsonwebtoken';
import {User} from "../schemas/user-schema";
import {recaptchaVerification} from "../utils/recaptcha-verification";
import {Request, Response} from "express";

export async function validateTokenWithRecaptchaV3(req: Request, res: Response, next: () => void) {
    await recaptchaVerification(req.headers['recaptchakey'], 'v3').then(async (r) => {
        /* Check if the user is sending to the server a proper recaptchaKey before continuing */
        if (r.success) {
            next();
        } else {
            /* If the recaptchaKey is not valid the user will be forced to leave the application */
            return res?.status(403)?.json({
                error: true,
                message: "Not authorized to proceed. Please Login again",
                forceLogout: true
            });
        }
    }).catch((err: any) => {
        console.log('Error in recaptcha validation v3: ', err);
        return res?.status(403)?.json({
            error: true,
            message: "Not authorized to proceed.",
            forceLogout: true
        });
    });
}

export async function validateToken(req: Request, res: Response, next: () => void) {
    const authorizationHeader = req.headers.authorization;
    let result: any;
    if (!authorizationHeader)
        return res.status(401).json({
            error: true,
            message: "Access token is missing",
        });
    let token: string;
    if (req.headers.authorization) token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    else {
        result = {
            error: true,
            message: `Authorization error`,
        };
        return res.status(403).json(result);
    }
    const options = {
        expiresIn: "1h",
    };
    try {
        const user = await User.findOne({
            accessToken: token,
        });
        if (!user) {
            result = {
                error: true,
                message: `Authorization error`,
            };
            return res.status(403).json(result);
        }

        result = jwt.verify(token, process.env.JWT_SECRET as Secret, options as VerifyOptions);

        if (!user.userId === result.id) {
            result = {
                error: true,
                message: `Invalid token`,
            };

            return res.status(401).json(result);
        }

        result["referralCode"] = user.referralCode;

        // req.decoded = result;
        next();
    } catch (err: any) {
        // console.log(err);
        if (err.name === "TokenExpiredError") {
            result = {
                error: true,
                message: `TokenExpired`,
            };
        } else {
            result = {
                error: true,
                message: `Authentication error`,
            };
        }
        return res.status(403).json(result);
    }
}
