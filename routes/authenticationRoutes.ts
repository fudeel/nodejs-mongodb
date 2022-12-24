/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {
    getCurrentUserInfo,
    LoginWithEmailAndPassword,
    RegisterWithEmailAndPassword,
    VerifyAuthenticationToken
} from "../src/authentication/authentication";

const router = express.Router();

router.post('/oauth-login', cleanBody, LoginWithEmailAndPassword);
router.post('/oauth-register', cleanBody, RegisterWithEmailAndPassword);
router.get('/verify-token', cleanBody, VerifyAuthenticationToken);
router.get('/get-current-user-info', cleanBody, getCurrentUserInfo);

export default router;