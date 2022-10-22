import jwt from 'jsonwebtoken';
import {User} from "../schemas/user-schema.js";
import {recaptchaVerification} from "../utils/recaptcha-verification.js";

export async function validateTokenWithRecaptchaV3(req, res, next) {

    await recaptchaVerification(req.headers['recaptchakey'], 'v3').then(async (r) => {
        /* Check if the user is sending to the server a proper recaptchaKey before continuing */
        console.log('headers: ', req.headers);
        console.log('R: ', r);
        if (r.success) {
            /* if recaptchaKey is valid, continue to check if the authorization code is valid */
            console.log('AAAAAAAAAAAAA');
            const authorizationHeader = req.headers.authorization;
            let result;
            if (!authorizationHeader)
                return res.status(401).json({
                    error: true,
                    message: "Access token is missing",
                    forceLogout: true
                });

            const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
            const options = {
                expiresIn: "1h",
            };

            try {
                let user = await User.findOne({
                    accessToken: token,
                });
                if (!user) {
                    result = {
                        error: true,
                        message: `Authorization error`,
                        forceLogout: true
                    };
                    return res.status(403).json(result);
                }

                result = jwt.verify(token, process.env.JWT_SECRET, options);

                if (!user.userId === result.id) {
                    result = {
                        error: true,
                        message: `Invalid token`,
                        forceLogout: true
                    };

                    return res.status(401).json(result);
                }

                result["referralCode"] = user.referralCode;

                req.decoded = result;
                next();
            } catch (err) {
                // console.log(err);
                if (err.name === "TokenExpiredError") {
                    result = {
                        error: true,
                        message: `TokenExpired`,
                        forceLogout: true
                    };
                } else {
                    result = {
                        error: true,
                        message: `Authentication error`,
                        forceLogout: true
                    };
                }
                return res.status(403).json(result);
            }
        } else {
            /* If the recaptchaKey is not valid the user will be forced to leave the application */
            return res?.status(403)?.json({
                error: true,
                message: "Not authorized to proceed. Please Login again",
                forceLogout: true
            });
        }
    }).catch((err) => {
        console.log('ERROR: ', err);
        return res?.status(403)?.json({
            error: true,
            message: "Not authorized to proceed."
        });
    });
}

export async function validateToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (!authorizationHeader)
        return res.status(401).json({
            error: true,
            message: "Access token is missing",
        });

    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
        expiresIn: "1h",
    };
    try {
        let user = await User.findOne({
            accessToken: token,
        });
        if (!user) {
            result = {
                error: true,
                message: `Authorization error`,
            };
            return res.status(403).json(result);
        }

        result = jwt.verify(token, process.env.JWT_SECRET, options);

        if (!user.userId === result.id) {
            result = {
                error: true,
                message: `Invalid token`,
            };

            return res.status(401).json(result);
        }

        result["referralCode"] = user.referralCode;

        req.decoded = result;
        next();
    } catch (err) {
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
