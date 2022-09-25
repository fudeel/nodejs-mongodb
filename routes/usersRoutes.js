import express from "express";
import {cleanBody} from "../middlewares/cleanbody.js";
import {validateToken} from "../middlewares/validateToken.js";
import {Signup, Activate, Login, recover, reset, ResetPassword, ReferredAccounts, Logout} from "../src/user/user.controller.js";
import {checkUserActivation} from "../src/user/user-data.controller.js";
import {sendNewActivationCode} from "../src/authentication/authentication.js";

const router = express.Router();
const baseUrl = '/auth'

router.post(baseUrl + "/signup", cleanBody, Signup);

router.patch(baseUrl + "/activate", cleanBody, Activate);

router.post(baseUrl + "/login", cleanBody, Login);

router.patch(baseUrl + "/recover", cleanBody, recover);

router.patch(baseUrl + "/reset", cleanBody, ResetPassword);

router.get(baseUrl + "/referred", validateToken, ReferredAccounts);

router.get(baseUrl + "/logout", validateToken, Logout);

router.post(baseUrl + "/verify-active", cleanBody, checkUserActivation);

router.post(baseUrl + "/send-new-active-code", cleanBody, sendNewActivationCode);


export default router;
