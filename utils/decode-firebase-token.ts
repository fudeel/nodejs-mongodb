import admin from "./config";
import {CustomResponse} from "../models/CustomResponse";
import {Response} from "express";

export const decodeFirebaseToken = async (req: any, res: Response, next: () => void) => {
    return await admin.auth().verifyIdToken(req.headers['idtoken'])
        .then((decodedToken) => {
            req.firebaseDecoded = decodedToken
            next()
        })
        .catch((error) => {
            throw<CustomResponse> {
                error: true,
                message: error.message,
                forceLogout: true,
                status:400
            }
        });
}