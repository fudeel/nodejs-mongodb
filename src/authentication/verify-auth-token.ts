import {Request, Response} from "express";
import {verifyIdToken} from "../../utils/verify-token";

export const VerifyAuthenticationToken = async (req: Request, res: Response, next: () => void) => {
    if (req.headers['idtoken'] !== null && req.headers['idtoken'] !== '') {
        try {
            await verifyIdToken(req, res, next);
        } catch (e) {
            res.status(403).send(false)
        }
    }
}