import admin from "./config.js";

export const decodeToken = async (token) => {
    return await admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            return decodedToken.email;
        })
        .catch((error) => {
            return error;
        });
}