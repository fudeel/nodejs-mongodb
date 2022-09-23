import admin from "./config.js";

export const verifyIdToken = async (req, res, next) => {
    let idToken = req.headers['idtoken'];

    return await admin.auth().verifyIdToken(idToken)
        .then(() => {
            res.status(200).send(true)
            next();
        })
        .catch(() => {
            res.status(200).send(false)
            next();
        })
}
