"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceAccount = void 0;
/***
 * @description: This is the firebase-admin initialization path. In order to use firebase-admin functionalities, it must be initialized before.
 * @type {{installations: any, FirebaseArrayIndexError: any, storage: any, projectManagement: any, auth: any, AppOptions: any, database: any, apps: (app.App | null)[], remoteConfig: any, FirebaseError: any, messaging: any, SDK_VERSION: string, appCheck: any, initializeApp: (options?: AppOptions, name?: string) => app.App, app: app, firestore: any, machineLearning: any, instanceId: any, securityRules: any, credential: credential, ServiceAccount: any, GoogleOAuthAccessToken: any} | {}}
 */
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const pathToEnv = path_1.default.basename('../.env');
const environment = dotenv.config({ path: pathToEnv });
exports.serviceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKey: (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL
};
exports.default = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(exports.serviceAccount)
});
//# sourceMappingURL=config.js.map