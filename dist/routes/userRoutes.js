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
const user_data_controller_1 = require("../src/user/user-data.controller");
const validateToken_1 = require("../middlewares/validateToken");
const router = express_1.default.Router();
router.patch('/update-basic-info', cleanbody_1.cleanBody, validateToken_1.validateToken, user_data_controller_1.UpdateBasicInfo);
router.patch('/update-shipping-address-info', cleanbody_1.cleanBody, validateToken_1.validateToken, user_data_controller_1.UpdateShippingAddressInfo);
router.patch('/update-social-network', cleanbody_1.cleanBody, validateToken_1.validateToken, user_data_controller_1.UpdateSocialNetwork);
router.patch('/update-become-seller-request', cleanbody_1.cleanBody, validateToken_1.validateToken, user_data_controller_1.UpdateBecomeSellerRequest);
router.get('/delete-become-seller-request', cleanbody_1.cleanBody, validateToken_1.validateToken, user_data_controller_1.DeleteBecomeSellerRequest);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map