import admin from "./config.js";

export const verifyIdToken = async (req, res, next) => {
    let idToken = req.headers['idtoken'];

    return await admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            console.log({'Decoded token': decodedToken, 'uid': uid});
            res.status(200).send(true)
            next();
        })
        .catch((err) => {
            console.log('error: ', err);
            res.status(200).send(false)
            next();
        })
}
