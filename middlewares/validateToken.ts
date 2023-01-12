import jwt, {Secret, VerifyOptions} from 'jsonwebtoken';
import {User} from "../schemas/user-schema";
import {Response} from "express";
import {CustomResponse} from "../models/CustomResponse";


export async function validateToken(req: any, res: Response, next: () => void) {
    const authorizationHeader = req.headers.authorization;
    console.log('>  auth token header: ', authorizationHeader);
    let result: any;
    if (!authorizationHeader) {
        const customResponse: CustomResponse = {
            error: true,
            message: "Access token is missing",
            status: 401,
            forceLogout: true
        }
        return res.status(401).send(customResponse);
    }

    let token: string;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    } // Bearer <token>
    else {
        const customResponse: CustomResponse = {
            error: true,
            message: `Authorization error`,
            status: 403,
            forceLogout: true
        }
        return res.status(403).send(customResponse);
    }
    const options = {
        expiresIn: "1h",
    };
    try {
        const user = await User.findOne({
            accessToken: token,
        });
        if (!user) {
            const customResponse: CustomResponse = {
                error: true,
                message: `Authorization error`,
                status: 403,
                forceLogout: true
            }
            return res.status(403).send(customResponse);
        }

        result = jwt.verify(token, process.env.JWT_SECRET as Secret, options as VerifyOptions);

        if (!user.userId === result.id) {
            const customResponse: CustomResponse = {
                error: true,
                message: `Invalid token`,
                status: 401,
                forceLogout: true
            }
            return res.status(401).send(customResponse);
        }

        result["referralCode"] = user.referralCode;

        console.log('result: ', result);

        req.decoded = result;
        next();
    } catch (err: any) {
        // console.log(err);
        if (err.name === "TokenExpiredError") {
            const customResponse: CustomResponse = {
                error: true,
                message: 'Token expired',
                status: 401,
                forceLogout: true
            }
            return res.status(401).send(customResponse);
        } else {
            const customResponse: CustomResponse = {
                error: true,
                message: `Authentication error`,
                status: 403,
                forceLogout: true
            }
            return res.status(403).send(customResponse);
        }
    }
}
