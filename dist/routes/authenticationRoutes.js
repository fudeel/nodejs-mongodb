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
const login_1 = require("../src/authentication/login");
const register_1 = require("../src/authentication/register");
const authenticated_user_1 = require("../src/authentication/authenticated-user");
const activate_1 = require("../src/authentication/activate");
const reset_password_1 = require("../src/authentication/reset-password");
const validateToken_1 = require("../middlewares/validateToken");
const referral_1 = require("../src/authentication/referral");
const logout_1 = require("../src/authentication/logout");
const send_new_activation_code_1 = require("../src/authentication/send-new-activation-code");
const verify_activation_1 = require("../src/authentication/verify-activation");
const recaptcha_verification_1 = require("../middlewares/recaptcha-verification");
const router = express_1.default.Router();
router.post('/oauth-login', cleanbody_1.cleanBody, recaptcha_verification_1.recaptchaVerification, login_1.Login);
router.post('/oauth-register', cleanbody_1.cleanBody, recaptcha_verification_1.recaptchaVerification, register_1.Signup);
router.get('/get-current-user-info', cleanbody_1.cleanBody, validateToken_1.validateToken, authenticated_user_1.getCurrentUserInfo);
router.patch("/activate", cleanbody_1.cleanBody, activate_1.Activate);
router.patch("/recover", cleanbody_1.cleanBody, reset_password_1.recover);
router.patch("/reset", cleanbody_1.cleanBody, reset_password_1.ResetPassword);
router.get("/referred", validateToken_1.validateToken, referral_1.ReferredAccounts);
router.get("/logout", validateToken_1.validateToken, logout_1.Logout);
router.post("/verify-active", cleanbody_1.cleanBody, validateToken_1.validateToken, verify_activation_1.checkUserActivation);
router.post("/send-new-active-code", cleanbody_1.cleanBody, send_new_activation_code_1.sendNewActivationCode);
exports.default = router;
//# sourceMappingURL=authenticationRoutes.js.map