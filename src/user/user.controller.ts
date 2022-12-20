import Joi from "joi";
import {v4} from 'uuid';
import {customAlphabet} from "nanoid";
import {generateJwt} from "../../utils/generateJwt";
import {sendEmail} from "../../utils/mailer";
import {comparePasswords, hashPassword, User} from "../../schemas/user-schema";
import {generateNewActivationCode} from "../../utils/activate-account";
import {findUser} from "../../utils/find-user";
import {Request, Response} from "express";

const CHARACTER_SET =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const REFERRAL_CODE_LENGTH = 8;

const referralCode = customAlphabet(CHARACTER_SET, REFERRAL_CODE_LENGTH);

//Validate user schema
const userSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(4),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    username: Joi.string().required().min(4).max(16),
    recaptchaKey: Joi.string().required(),
    referrer: Joi.string(),
});

export const Signup = async (req: Request, res: Response) => {
    try {
        let isError = false;
        const result = await userSchema.validate(req.body);
        if (result.error) {
            return await res.status(500).json({
                error: true,
                message: result.error.message.toString(),
            });
        }

        if (!isError)
        await User.findOne({
            email: result.value.email,
        }).then( (user) => {
            if (user) {
                isError = true;
                return res.status(500).json({
                    error: true,
                    message: "Email already exists.",
                });
            }
        });

        if (!isError)
        await User.findOne({
            username: result.value.username,
        }).then( (user) => {
            if (user) {
                isError = true;
                return res.status(500).json({
                    error: true,
                    message: "username already exists.",
                });
            }
        });


        const hash = await hashPassword(result.value.password);


        //Generate unique id for the user.
        result.value.userId = v4();

        delete result.value.confirmPassword;
        result.value.password = hash;


        if (!isError) {
            const activateEmail = await generateNewActivationCode(result.value.email);

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
            const newUser = await new User(result.value);
            await newUser.save();

            return res.status(200).json({
                success: true,
                message: "Registration Success",
                referralCode: result.value.referralCode,
            });
        }

    } catch (error) {
        console.error("Catch error in Signup: ", error);
    }
};

export const Activate = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.json({
                error: true,
                status: 400,
                message: "Please make a valid request",
            });
        }
        const user = await User.findOne({
            email: email,
            emailToken: code,
            emailTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(200).json({
                error: true,
                message: "The code is not valid",
            });
        } else {
            if (user.active)
                return res.send({
                    error: true,
                    message: "Account already activated",
                    status: 400,
                });

            user.emailToken = null;
            user.emailTokenExpires = null;
            user.active = true;

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Account activated.",
            });
        }
    } catch (error: any) {
        console.error("activation-error: ", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

export const Login = async (req: Request, res: Response, googleIdToken: string) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }


        const user = await findUser(email, res, false);

        //3. Verify the password is valid
        const isValid = await comparePasswords(password, user.password);



        if (!isValid) {
            return res.status(400).json({
                error: true,
                message: "Invalid credentials",
            });
        }

        //Generate Access token

        const { error, token } = await generateJwt(user.email, user.userId);
        if (error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't create access token. Please try again later",
            });
        }
        user.accessToken = token;
        await user.save();

        //Success
        return res.send({
            success: true,
            message: "User logged in successfully",
            accessToken: token,
            idToken: googleIdToken
        });
    } catch (err) {
        console.error("Login error try-catch", err);
    }
};

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
        user.resetPasswordToken = code.toString();
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
    try {
        const { passwordResetToken, newPassword, confirmPassword } = req.body;
        if (!passwordResetToken || !newPassword || !confirmPassword) {
            return res.status(403).json({
                error: true,
                message:
                    "Couldn't process request. Please provide all mandatory fields",
            });
        }
        const user = await User.findOne({
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
        user.password = await hashPassword(req.body.newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = "";

        await user.save();

        return res.send({
            success: true,
            message: "Password has been changed",
        });
    } catch (error: any) {
        console.error("reset-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

export const ReferredAccounts = async (req: any, res: Response) => {
    try {
        const {referralCode } = req.decoded;

        const referredAccounts = await User.find(
            { referrer: referralCode },
            { email: 1, referralCode: 1, _id: 0 }
        );
        return res.send({
            success: true,
            accounts: referredAccounts,
            total: referredAccounts.length,
        });
    } catch (error: any) {
        console.error("fetch-referred-error: ", error);
    }
};

export const Logout = async (req: any, res: Response) => {
    try {
        const { id } = req.decoded;

        const user = await User.findOne({ userId: id });

        if (user) {
            user.accessToken = null;
            await user.save();
            return res.send({ success: true, message: "User Logged out" });
        } else {
            return res.status(401).send({
                error: true,

            })
        }
    } catch (error: any) {
        console.error("user-logout-error", error);
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
            user.resetPasswordExpires = expiry; // 15 minutes


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
                if (err) return res.status(500).json({message: err.message});

            });
        });
};
