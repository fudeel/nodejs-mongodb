/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

import express from "express";
import {cleanBody} from "../middlewares/cleanbody";
import {UpdateBasicInfo, UpdateShippingAddressInfo, UpdateSocialNetwork} from "../src/user/user-data.controller";
import {validateToken} from "../middlewares/validateToken";

const router = express.Router();

router.patch('/update-basic-info', cleanBody, validateToken, UpdateBasicInfo);
router.patch('/update-shipping-address-info', cleanBody, validateToken, UpdateShippingAddressInfo);
router.patch('/update-social-network', cleanBody, validateToken, UpdateSocialNetwork);

export default router;
