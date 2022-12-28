/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {UpdateBasicInfo} from "../src/user/user-data.controller";
import {validateToken} from "../middlewares/validateToken";
import {decodeFirebaseToken} from "../utils/decode-firebase-token";

const router = express.Router();

router.patch('/update-basic-info', cleanBody, validateToken, decodeFirebaseToken, UpdateBasicInfo);

export default router;
