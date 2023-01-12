/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {recaptchaVerification} from "../middlewares/recaptcha-verification";

const router = express.Router();

router.post("/validate-recaptcha-v2", cleanBody, recaptchaVerification, (req, res) => {
    res.status(200).send(true);
});

export default router;
