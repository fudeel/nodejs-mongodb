/***
 * @description: This is the firebase-admin initialization path. In order to use firebase-admin functionalities, it must be initialized before.
 * @type {{installations: any, FirebaseArrayIndexError: any, storage: any, projectManagement: any, auth: any, AppOptions: any, database: any, apps: (app.App | null)[], remoteConfig: any, FirebaseError: any, messaging: any, SDK_VERSION: string, appCheck: any, initializeApp: (options?: AppOptions, name?: string) => app.App, app: app, firestore: any, machineLearning: any, instanceId: any, securityRules: any, credential: credential, ServiceAccount: any, GoogleOAuthAccessToken: any} | {}}
 */
import admin, {ServiceAccount} from 'firebase-admin';
import path from "path";
import * as dotenv from 'dotenv';


const pathToEnv = path.basename('../.env');
const environment = dotenv.config({path: pathToEnv});



console.log('TYPE: ', process.env.TYPE);
console.log('PROJECT ID: ', process.env.PROJECT_ID);

export const serviceAccount: ServiceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL
}


export default admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
