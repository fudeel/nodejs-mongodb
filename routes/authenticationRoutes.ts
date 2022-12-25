/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {LoginWithEmailAndPassword} from "../src/authentication/login";
import {RegisterWithEmailAndPassword} from "../src/authentication/register";
import {VerifyAuthenticationToken} from "../src/authentication/verify-auth-token";
import {getCurrentUserInfo} from "../src/authentication/authenticated-user";
import {Activate} from "../src/authentication/activate";
import {recover, ResetPassword} from "../src/authentication/reset-password";
import {validateToken} from "../middlewares/validateToken";
import {ReferredAccounts} from "../src/authentication/referral";
import {Logout} from "../src/authentication/logout";
import {checkUserActivation} from "../src/user/user-data.controller";
import {sendNewActivationCode} from "../src/authentication/send-new-activation-code";

const router = express.Router();

router.post('/oauth-login', cleanBody, LoginWithEmailAndPassword);
router.post('/oauth-register', cleanBody, RegisterWithEmailAndPassword);
router.get('/verify-token', cleanBody, VerifyAuthenticationToken);
router.get('/get-current-user-info', cleanBody, getCurrentUserInfo);
router.patch("/activate", cleanBody, Activate);
router.patch("/recover", cleanBody, recover);
router.patch("/reset", cleanBody, ResetPassword);
router.get("/referred", validateToken, ReferredAccounts);
router.get("/logout", validateToken, Logout);
router.post("/verify-active", cleanBody, checkUserActivation);
router.post("/send-new-active-code", cleanBody, sendNewActivationCode);

export default router;
