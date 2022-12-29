import {Request, Response} from "express";
import {hashPassword, User} from "../../schemas/user-schema";
import {sendEmail} from "../../utils/mailer";
import {CustomResponse} from "../../models/CustomResponse";

export const ForgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                status: 400,
                error: true,
                message: "Cannot be processed",
            });
        }
        const user = await User.findOne({
            email: email,
        });
        if (!user) {
            return res.send({
                success: true,
                message:
                    "If that email address is in our database, we will send you an email to reset your password",
            });
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        const response = await sendEmail(user.email, code, "reset");

        if (response.error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't send mail. Please try again later.",
            });
        }

        const expiry = Date.now() + 60 * 1000 * 15;
        user.resetPasswordToken = code;
        user.resetPasswordExpires = new Date(expiry); // 15 minutes

        await user.save();

        return res.send({
            success: true,
            message:
                "If that email address is in our database, we will send you an email to reset your password",
        });
    } catch (error: any) {
        console.error("forgot-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};


export const ResetPassword = async (req: Request, res: Response) => {
    console.log('reset password body: ', req.body);
    try {
        const { passwordResetToken, newPassword, confirmNewPassword } = req.body;
        if (!passwordResetToken || !newPassword || !confirmNewPassword) {
            console.log('11111');
            console.log('passwordResetToken', passwordResetToken);
            console.log('newPassword', newPassword);
            console.log('confirmNewPassword', confirmNewPassword);
            return res.status(403).json(<CustomResponse>{
                error: true,
                message:
                    "Couldn't process request. Please provide all mandatory fields",
                status: 403
            });
        }
        const user = await User.findOne({
            resetPasswordToken: req.body['passwordResetToken'],
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            console.log('2222');
            return res.send(<CustomResponse>{
                error: true,
                message: "Password reset token is invalid or has expired.",
                status: 401
            });
        }
        if (newPassword !== confirmNewPassword) {
            console.log('3333');
            return res.status(400).json(<CustomResponse>{
                error: true,
                message: "Passwords didn't match",
                status: 400
            });
        }

        console.log('444444');
        user.password = await hashPassword(req.body.newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        console.log('555555');
        return res.send({
            success: true,
            message: "Password has been changed",
        });
    } catch (error: any) {
        console.log('666666');
        console.error("reset-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

// ===PASSWORD RECOVER AND RESET

// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
export const recover = async (req: Request, res: Response) => {
    User.findOne({email: req.body.email})
        .then(async user => {
            if (!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

            //Generate and set password reset token
            const code = Math.floor(100000 + Math.random() * 900000);
            const expiry = Date.now() + 60 * 1000 * 15;
            user.resetPasswordToken = code;
            user.resetPasswordExpires = new Date(expiry); // 15 minutes


            // Save the updated user object
            await user.save()
                .then(async user => {
                    const action = "reset";
                    // send email
                    const link = process.env.BASE_HOST + "/api/v1/users/auth/reset?passwordResetToken=" + user.resetPasswordToken;

                    await sendEmail(user.email, user.resetPasswordToken, action, link).then(() => {
                        res.status(200).json({message: "If that email address is in our database, we will send you an email to reset your password"});
                    }).catch((error) => {
                        return res.status(500).json({message: error.message});
                    });
                })
                .catch(err => res.status(500).json({message: err.message}));
        })
        .catch(err => res.status(500).json({message: err.message}));
};

// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
export const reset = (req: Request, res: Response) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

            //Redirect user to form with the email address
            res.render('reset', {user});
        })
        .catch(err => res.status(500).json({message: err.message}));
};


// @route POST api/auth/reset
// @desc Reset Password
// @access Public
export const resetPassword = (req: Request, res: Response) => {
    User.findOne({resetPasswordToken: req.params['passwordResetToken'], resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

            //Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Save
            user.save((err) => {
                if (err) return res.status(500).json(<CustomResponse>{error: true, status: 500, message: err.message});

            });
        });
};