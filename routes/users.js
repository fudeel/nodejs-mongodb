const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");

const AuthController = require("../src/users/user.controller");

const baseUrl = '/auth'

router.post(baseUrl + "/signup", cleanBody, AuthController.Signup);

router.patch(baseUrl + "/activate", cleanBody, AuthController.Activate);

router.patch(baseUrl + "/recover", cleanBody, AuthController.recover);

router.patch(baseUrl + "/reset", cleanBody, AuthController.ResetPassword);

router.get(baseUrl + "/referred", validateToken, AuthController.ReferredAccounts);

router.get(baseUrl + "/logout", validateToken, AuthController.Logout);



module.exports = router;
