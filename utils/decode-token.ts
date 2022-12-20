import admin from "./config";

export const decodeToken = async (token: string) => {
    return await admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            return decodedToken.email;
        })
        .catch((error) => {
            return error;
        });
}