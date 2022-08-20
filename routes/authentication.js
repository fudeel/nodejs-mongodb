/***
 *
 * @description: This is the routing controller for the Google OAuth external provider.
 * The user must login using this service before accessing the private routes.
 * In this file there are only authentication/account and Google OAuth related routes
 */

const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/authentication/authentication");


router.post('/oauth-login', cleanBody, AuthController.LoginWithEmailAndPassword);


module.exports = router;
