/***
 * @description: This is the firebase-admin initialization path. In order to use firebase-admin functionalities, it must be initialized before.
 * @type {{installations: any, FirebaseArrayIndexError: any, storage: any, projectManagement: any, auth: any, AppOptions: any, database: any, apps: (app.App | null)[], remoteConfig: any, FirebaseError: any, messaging: any, SDK_VERSION: string, appCheck: any, initializeApp: (options?: AppOptions, name?: string) => app.App, app: app, firestore: any, machineLearning: any, instanceId: any, securityRules: any, credential: credential, ServiceAccount: any, GoogleOAuthAccessToken: any} | {}}
 */
const admin = require('firebase-admin');
const serviceAccount = require("../service_account.json");



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


module.exports = admin;
