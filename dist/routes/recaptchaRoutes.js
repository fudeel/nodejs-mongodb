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
const recaptchaValidator_1 = require("../src/recaptcha/recaptchaValidator");
const router = express_1.default.Router();
router.post('/validate-recaptcha-v2', cleanbody_1.cleanBody, recaptchaValidator_1.validateRecaptchaV2);
router.post('/validate-recaptcha-v3', cleanbody_1.cleanBody, recaptchaValidator_1.validateRecaptchaV3);
exports.default = router;
//# sourceMappingURL=recaptchaRoutes.js.map