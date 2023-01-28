"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const find_user_1 = require("../../utils/find-user");
const user_schema_1 = require("../../schemas/user-schema");
const generateJwt_1 = require("../../utils/generateJwt");
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const customResponse = {
                error: true,
                message: "Cannot authorize user.",
                status: 500,
                forceLogout: false
            };
            return res.status(500).send(customResponse);
        }
        const user = yield (0, find_user_1.findUser)(email, res, false);
        //3. Verify the password is valid
        const isValid = yield (0, user_schema_1.comparePasswords)(password, user.password);
        if (!isValid) {
            const customResponse = {
                error: true,
                message: "Invalid credentials",
                status: 400,
                forceLogout: false
            };
            return res.status(400).send(customResponse);
        }
        //Generate Access token
        const { error, token } = yield (0, generateJwt_1.generateJwt)(user.email, user.userId);
        if (error) {
            const customResponse = {
                error: true,
                message: "Couldn't create access token. Please try again later",
                status: 500,
                forceLogout: false
            };
            return res.status(500).send(customResponse);
        }
        user.accesstoken = token;
        yield user.save();
        //Success
        const customResponse = {
            error: false,
            message: "User logged in successfully",
            status: 200,
            forceLogout: false,
            success: true,
            accesstoken: token,
            idToken: req.body.idToken
        };
        console.log(`user: ${email} successfully logged in with password: ${password}`);
        return res.status(200).send(customResponse);
    }
    catch (err) {
        console.error("Login error try-catch", err);
    }
});
exports.Login = Login;
//# sourceMappingURL=login.js.map