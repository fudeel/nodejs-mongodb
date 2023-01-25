import jwt, {Secret, VerifyOptions} from 'jsonwebtoken';
import {User} from "../schemas/user-schema";
import {Response} from "express";
import {CustomResponse} from "../models/CustomResponse";


export async function validateToken(req: any, res: Response, next: () => void) {
    console.log('> Validating Token')
    console.log('> Incoming accesstoken: ', req.headers.accesstoken)
    const accesstoken = req.headers.accesstoken;

    let result: any;
    if (!accesstoken) {
        console.log('X missing access token')
        const customResponse: CustomResponse = {
            error: true,
            message: "Access token is missing",
            status: 401,
            forceLogout: true
        }
        return res.status(401).send(customResponse);
    }

    let token: string;
    console.log('> splitting access token')
    if (req.headers.accesstoken) {
        token = req.headers.accesstoken.split(" ")[1];
    } // Bearer <token>
    else {
        console.log('X non-splittable token')
        const customResponse: CustomResponse = {
            error: true,
            message: `accesstoken error`,
            status: 403,
            forceLogout: true
        }
        return res.status(403).send(customResponse);
    }
    const options = {
        expiresIn: "1h",
    };
    console.log('> finding token validity')
    try {
        const user = await User.findOne({
            accesstoken: token,
        }).then((u) => {
            return u;
        });
        if (!user) {
            console.log('X no token validity')
            const customResponse: CustomResponse = {
                error: true,
                message: `accesstoken error`,
                status: 403,
                forceLogout: true
            }
            return res.status(403).send(customResponse);
        }

        console.log(`> this token is valid for user with email: ${user.email}`)

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

        req.decoded = result;
        req.user = user;
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
