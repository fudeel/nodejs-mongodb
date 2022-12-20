import admin from "./config";
import {Request, Response} from "express";

export const verifyIdToken = async (req: Request, res: Response, next: () => void) => {
    const idToken = req.headers['idtoken'];

    return await admin.auth().verifyIdToken(<string>idToken)
        .then(async (decodedToken) => {
            await console.log({'Decoded token': decodedToken});
            res.status(200).send(true)
            next();
        })
        .catch(() => {
            res.status(200).send(false)
            next();
        })
}
