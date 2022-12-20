"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cleanbody_1 = require("../middlewares/cleanbody");
const validateToken_1 = require("../middlewares/validateToken");
const user_controller_1 = require("../src/user/user.controller");
const user_data_controller_1 = require("../src/user/user-data.controller");
const authentication_1 = require("../src/authentication/authentication");
const router = express_1.default.Router();
const baseUrl = '/auth';
router.post(baseUrl + "/signup", cleanbody_1.cleanBody, user_controller_1.Signup);
router.patch(baseUrl + "/activate", cleanbody_1.cleanBody, user_controller_1.Activate);
router.post(baseUrl + "/login", cleanbody_1.cleanBody, authentication_1.LoginWithEmailAndPassword);
router.patch(baseUrl + "/recover", cleanbody_1.cleanBody, user_controller_1.recover);
router.patch(baseUrl + "/reset", cleanbody_1.cleanBody, user_controller_1.ResetPassword);
router.get(baseUrl + "/referred", validateToken_1.validateToken, user_controller_1.ReferredAccounts);
router.get(baseUrl + "/logout", validateToken_1.validateToken, user_controller_1.Logout);
router.post(baseUrl + "/verify-active", cleanbody_1.cleanBody, user_data_controller_1.checkUserActivation);
router.post(baseUrl + "/send-new-active-code", cleanbody_1.cleanBody, authentication_1.sendNewActivationCode);
exports.default = router;
//# sourceMappingURL=usersRoutes.js.map