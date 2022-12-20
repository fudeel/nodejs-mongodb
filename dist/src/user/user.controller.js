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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.reset = exports.recover = exports.Logout = exports.ReferredAccounts = exports.ResetPassword = exports.ForgotPassword = exports.Login = exports.Activate = exports.Signup = void 0;
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const nanoid_1 = require("nanoid");
const generateJwt_1 = require("../../utils/generateJwt");
const mailer_1 = require("../../utils/mailer");
const user_schema_1 = require("../../schemas/user-schema");
const activate_account_1 = require("../../utils/activate-account");
const find_user_1 = require("../../utils/find-user");
const CHARACTER_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const REFERRAL_CODE_LENGTH = 8;
const referralCode = (0, nanoid_1.customAlphabet)(CHARACTER_SET, REFERRAL_CODE_LENGTH);
//Validate user schema
const userSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email({ minDomainSegments: 2 }),
    password: joi_1.default.string().required().min(4),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
    username: joi_1.default.string().required().min(4).max(16),
    recaptchaKey: joi_1.default.string().required(),
    referrer: joi_1.default.string(),
});
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let isError = false;
        const result = yield userSchema.validate(req.body);
        if (result.error) {
            return yield res.status(500).json({
                error: true,
                message: result.error.message.toString(),
            });
        }
        if (!isError)
            yield user_schema_1.User.findOne({
                email: result.value.email,
            }).then((user) => {
                if (user) {
                    isError = true;
                    return res.status(500).json({
                        error: true,
                        message: "Email already exists.",
                    });
                }
            });
        if (!isError)
            yield user_schema_1.User.findOne({
                username: result.value.username,
            }).then((user) => {
                if (user) {
                    isError = true;
                    return res.status(500).json({
                        error: true,
                        message: "username already exists.",
                    });
                }
            });
        const hash = yield (0, user_schema_1.hashPassword)(result.value.password);
        //Generate unique id for the user.
        result.value.userId = (0, uuid_1.v4)();
        delete result.value.confirmPassword;
        result.value.password = hash;
        if (!isError) {
            const activateEmail = yield (0, activate_account_1.generateNewActivationCode)(result.value.email);
            result.value.emailToken = activateEmail.code;
            result.value.emailTokenExpires = activateEmail.expiry;
            /*//Check if referred and validate code.
            if (result.value.hasOwnProperty("referrer") && !isError) {
                const referrer = await User.findOne({
                    referralCode: result.value.referrer,
                });
                if (!referrer) {
                    return res.status(400).send({
                        error: true,
                        message: "Invalid referral code.",
                    });
                }
            }*/
            result.value.referralCode = referralCode();
            const newUser = yield new user_schema_1.User(result.value);
            yield newUser.save();
            return res.status(200).json({
                success: true,
                message: "Registration Success",
                referralCode: result.value.referralCode,
            });
        }
    }
    catch (error) {
        console.error("Catch error in Signup: ", error);
    }
});
exports.Signup = Signup;
const Activate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.json({
                error: true,
                status: 400,
                message: "Please make a valid request",
            });
        }
        const user = yield user_schema_1.User.findOne({
            email: email,
            emailToken: code,
            emailTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(200).json({
                error: true,
                message: "The code is not valid",
            });
        }
        else {
            if (user.active)
                return res.send({
                    error: true,
                    message: "Account already activated",
                    status: 400,
                });
            user.emailToken = null;
            user.emailTokenExpires = null;
            user.active = true;
            yield user.save();
            return res.status(200).json({
                success: true,
                message: "Account activated.",
            });
        }
    }
    catch (error) {
        console.error("activation-error: ", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});
exports.Activate = Activate;
const Login = (req, res, googleIdToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }
        const user = yield (0, find_user_1.findUser)(email, res, false);
        //3. Verify the password is valid
        const isValid = yield (0, user_schema_1.comparePasswords)(password, user.password);
        if (!isValid) {
            return res.status(400).json({
                error: true,
                message: "Invalid credentials",
            });
        }
        //Generate Access token
        const { error, token } = yield (0, generateJwt_1.generateJwt)(user.email, user.userId);
        if (error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't create access token. Please try again later",
            });
        }
        user.accessToken = token;
        yield user.save();
        //Success
        return res.send({
            success: true,
            message: "User logged in successfully",
            accessToken: token,
            idToken: googleIdToken
        });
    }
    catch (err) {
        console.error("Login error try-catch", err);
    }
});
exports.Login = Login;
const ForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                status: 400,
                error: true,
                message: "Cannot be processed",
            });
        }
        const user = yield user_schema_1.User.findOne({
            email: email,
        });
        if (!user) {
            return res.send({
                success: true,
                message: "If that email address is in our database, we will send you an email to reset your password",
            });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        const response = yield (0, mailer_1.sendEmail)(user.email, code, "reset");
        if (response.error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't send mail. Please try again later.",
            });
        }
        const expiry = Date.now() + 60 * 1000 * 15;
        user.resetPasswordToken = code.toString();
        user.resetPasswordExpires = new Date(expiry); // 15 minutes
        yield user.save();
        return res.send({
            success: true,
            message: "If that email address is in our database, we will send you an email to reset your password",
        });
    }
    catch (error) {
        console.error("forgot-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});
exports.ForgotPassword = ForgotPassword;
const ResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { passwordResetToken, newPassword, confirmPassword } = req.body;
        if (!passwordResetToken || !newPassword || !confirmPassword) {
            return res.status(403).json({
                error: true,
                message: "Couldn't process request. Please provide all mandatory fields",
            });
        }
        const user = yield user_schema_1.User.findOne({
            resetPasswordToken: req.body['passwordResetToken'],
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.send({
                error: true,
                message: "Password reset token is invalid or has expired.",
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error: true,
                message: "Passwords didn't match",
            });
        }
        user.password = yield (0, user_schema_1.hashPassword)(req.body.newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = "";
        yield user.save();
        return res.send({
            success: true,
            message: "Password has been changed",
        });
    }
    catch (error) {
        console.error("reset-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});
exports.ResetPassword = ResetPassword;
const ReferredAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { referralCode } = req.decoded;
        const referredAccounts = yield user_schema_1.User.find({ referrer: referralCode }, { email: 1, referralCode: 1, _id: 0 });
        return res.send({
            success: true,
            accounts: referredAccounts,
            total: referredAccounts.length,
        });
    }
    catch (error) {
        console.error("fetch-referred-error: ", error);
    }
});
exports.ReferredAccounts = ReferredAccounts;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.decoded;
        const user = yield user_schema_1.User.findOne({ userId: id });
        if (user) {
            user.accessToken = null;
            yield user.save();
            return res.send({ success: true, message: "User Logged out" });
        }
        else {
            return res.status(401).send({
                error: true,
            });
        }
    }
    catch (error) {
        console.error("user-logout-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});
exports.Logout = Logout;
// ===PASSWORD RECOVER AND RESET
// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
const recover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_schema_1.User.findOne({ email: req.body.email })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user)
            return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });
        //Generate and set password reset token
        const code = Math.floor(100000 + Math.random() * 900000);
        const expiry = Date.now() + 60 * 1000 * 15;
        user.resetPasswordToken = code;
        user.resetPasswordExpires = expiry; // 15 minutes
        // Save the updated user object
        yield user.save()
            .then((user) => __awaiter(void 0, void 0, void 0, function* () {
            const action = "reset";
            // send email
            const link = process.env.BASE_HOST + "/api/v1/users/auth/reset?passwordResetToken=" + user.resetPasswordToken;
            yield (0, mailer_1.sendEmail)(user.email, user.resetPasswordToken, action, link).then(() => {
                res.status(200).json({ message: "If that email address is in our database, we will send you an email to reset your password" });
            }).catch((error) => {
                return res.status(500).json({ message: error.message });
            });
        }))
            .catch(err => res.status(500).json({ message: err.message }));
    }))
        .catch(err => res.status(500).json({ message: err.message }));
});
exports.recover = recover;
// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
const reset = (req, res) => {
    user_schema_1.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        .then((user) => {
        if (!user)
            return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });
        //Redirect user to form with the email address
        res.render('reset', { user });
    })
        .catch(err => res.status(500).json({ message: err.message }));
};
exports.reset = reset;
// @route POST api/auth/reset
// @desc Reset Password
// @access Public
const resetPassword = (req, res) => {
    user_schema_1.User.findOne({ resetPasswordToken: req.params['passwordResetToken'], resetPasswordExpires: { $gt: Date.now() } })
        .then((user) => {
        if (!user)
            return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });
        //Set the new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        // Save
        user.save((err) => {
            if (err)
                return res.status(500).json({ message: err.message });
        });
    });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=user.controller.js.map