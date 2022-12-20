"use strict";
/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cleanbody_1 = require("../middlewares/cleanbody");
const authentication_1 = require("../src/authentication/authentication");
const router = express_1.default.Router();
router.post('/oauth-login', cleanbody_1.cleanBody, authentication_1.LoginWithEmailAndPassword);
router.post('/oauth-register', cleanbody_1.cleanBody, authentication_1.RegisterWithEmailAndPassword);
router.get('/verify-token', cleanbody_1.cleanBody, authentication_1.VerifyAuthenticationToken);
router.get('/get-current-user-info', cleanbody_1.cleanBody, authentication_1.getCurrentUserInfo);
exports.default = router;
//# sourceMappingURL=authenticationRoutes.js.map