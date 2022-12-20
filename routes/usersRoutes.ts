import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {validateToken} from "../middlewares/validateToken";
import {Signup, Activate, recover, ResetPassword, ReferredAccounts, Logout} from "../src/user/user.controller";
import {checkUserActivation} from "../src/user/user-data.controller";
import {LoginWithEmailAndPassword, sendNewActivationCode} from "../src/authentication/authentication";

const router = express.Router();
const baseUrl = '/auth'

router.post(baseUrl + "/signup", cleanBody, Signup);

router.patch(baseUrl + "/activate", cleanBody, Activate);

router.post(baseUrl + "/login", cleanBody, LoginWithEmailAndPassword);

router.patch(baseUrl + "/recover", cleanBody, recover);

router.patch(baseUrl + "/reset", cleanBody, ResetPassword);

router.get(baseUrl + "/referred", validateToken, ReferredAccounts);

router.get(baseUrl + "/logout", validateToken, Logout);

router.post(baseUrl + "/verify-active", cleanBody, checkUserActivation);

router.post(baseUrl + "/send-new-active-code", cleanBody, sendNewActivationCode);


export default router;
