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
exports.resetPassword = exports.reset = exports.recover = exports.ResetPassword = exports.ForgotPassword = void 0;
const user_schema_1 = require("../../schemas/user-schema");
const mailer_1 = require("../../utils/mailer");
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
        user.resetPasswordToken = code;
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
        const { passwordResetToken, newPassword, confirmNewPassword } = req.body;
        if (!passwordResetToken || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                error: true,
                message: "Couldn't process request. Please provide all mandatory fields",
                status: 403
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
                status: 401
            });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                error: true,
                message: "Passwords didn't match",
                status: 400
            });
        }
        user.password = yield (0, user_schema_1.hashPassword)(req.body.newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
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
        user.resetPasswordExpires = new Date(expiry); // 15 minutes
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
                return res.status(500).json({ error: true, status: 500, message: err.message });
        });
    });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=reset-password.js.map