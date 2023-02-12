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
const recaptcha_verification_1 = require("../middlewares/recaptcha-verification");
const router = express_1.default.Router();
router.post("/validate-recaptcha-v2", cleanbody_1.cleanBody, recaptcha_verification_1.recaptchaVerification, (req, res) => {
    res.status(200).send(true);
});
exports.default = router;
//# sourceMappingURL=securityRoutes.js.map