import admin from "./config.js";

export const verifyIdToken = (req, res, next) => {
    let idToken = req.headers['idtoken'];

    return admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            console.log({'Decoded token': decodedToken, 'uid': uid});
            next();
        })
        .catch((err) => {
            console.log('error: ', err);
            next();
        })
}
