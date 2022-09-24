import admin from "./config.js";

export const verifyIdToken = async (req, res, next) => {
    const idToken = req.headers['idtoken'];

    return await admin.auth().verifyIdToken(idToken)
        .then(async (decodedToken) => {
            await console.log({'Decoded token': decodedToken});
            res.status(200).send(true)
            next();
        })
        .catch((error) => {
            console.log('error verify token: ', error);
            res.status(200).send(false)
            next();
        })
}
