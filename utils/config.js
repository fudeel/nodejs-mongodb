/***
 * @description: This is the firebase-admin initialization path. In order to use firebase-admin functionalities, it must be initialized before.
 * @type {{installations: any, FirebaseArrayIndexError: any, storage: any, projectManagement: any, auth: any, AppOptions: any, database: any, apps: (app.App | null)[], remoteConfig: any, FirebaseError: any, messaging: any, SDK_VERSION: string, appCheck: any, initializeApp: (options?: AppOptions, name?: string) => app.App, app: app, firestore: any, machineLearning: any, instanceId: any, securityRules: any, credential: credential, ServiceAccount: any, GoogleOAuthAccessToken: any} | {}}
 */
import admin from 'firebase-admin';
import path from "path";
import * as dotenv from 'dotenv';


const pathToEnv = path.basename('../.env');
const environment = dotenv.config({path: pathToEnv});



console.log('TYPE: ', process.env.TYPE);
console.log('PROJECT ID: ', process.env.PROJECT_ID);

export const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
}


export default admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
