/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {validateRecaptchaV2, validateRecaptchaV3} from "../src/recaptcha/recaptchaValidator";

const router = express.Router();

router.post('/validate-recaptcha-v2', cleanBody, validateRecaptchaV2);
router.post('/validate-recaptcha-v3', cleanBody, validateRecaptchaV3);


export default router;
