import Joi from "joi";
import {v4} from "uuid";
import {customAlphabet} from "nanoid";
import {generateJwt} from "../../utils/generateJwt.js";
import {sendEmail} from "../../utils/mailer.js";
import {comparePasswords, hashPassword, User} from "../../schemas/user-schema.js";
import crypto from "crypto";

const CHARACTER_SET =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const REFERRAL_CODE_LENGTH = 8;

const referralCode = customAlphabet(CHARACTER_SET, REFERRAL_CODE_LENGTH);

//Validate user schema
const userSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(4),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    referrer: Joi.string(),
});

export const Signup = async (req, res) => {
    try {
        const result = userSchema.validate(req.body);
        if (result.error) {
            console.log(result.error.message);
            return res.json({
                error: true,
                status: 400,
                message: result.error.message,
            });
        }

        //Check if the email has been already registered.
        const user = await User.findOne({
            email: result.value.email,
        });

        if (user) {
            return res.json({
                error: true,
                message: "Email is already in use",
            });
        }

        const hash = await hashPassword(result.value.password);


         //Generate unique id for the user.
        result.value.userId = v4();

        delete result.value.confirmPassword;
        result.value.password = hash;

        const code = Math.floor(100000 + Math.random() * 900000);

        let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms

        const sendVerificationLink = await sendEmail(result.value.email, code, "activate");

        if (sendVerificationLink.error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't send verification email.",
            });
        }
        result.value.emailToken = code;
        result.value.emailTokenExpires = new Date(expiry);

        //Check if referred and validate code.
        if (result.value.hasOwnProperty("referrer")) {
            let referrer = await User.findOne({
                referralCode: result.value.referrer,
            });
            if (!referrer) {
                return res.status(400).send({
                    error: true,
                    message: "Invalid referral code.",
                });
            }
        }
        result.value.referralCode = referralCode();
        const newUser = await new User(result.value);
        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "Registration Success",
            referralCode: result.value.referralCode,
        });
    } catch (error) {
        console.error("signup-error", error);
        return res.status(500).json({
            error: true,
            message: "Cannot Register",
        });
    }
};

export const Activate = async (req, res) => {
    try {
        const { email, code } = req.query;
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
            return res.status(400).json({
                error: true,
                message: "Invalid details",
            });
        } else {
            if (user.active)
                return res.send({
                    error: true,
                    message: "Account already activated",
                    status: 400,
                });

            user.emailToken = "";
            user.emailTokenExpires = null;
            user.active = true;

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Account activated.",
            });
        }
    } catch (error) {
        console.error("activation-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }

        //1. Find if any account with that email exists in DB
        const user = await User.findOne({ email: email });

        // NOT FOUND - Throw error
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Account not found",
            });
        }

        //2. Throw error if account is not activated
        if (!user.active) {
            return res.status(400).json({
                error: true,
                message: "You must verify your email to activate your account",
            });
        }

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
        });
    } catch (err) {
        console.error("Login error", err);
        return res.status(500).json({
            error: true,
            message: "Couldn't login. Please try again later.",
        });
    }
};

export const ForgotPassword = async (req, res) => {
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

        let code = Math.floor(100000 + Math.random() * 900000);
        let response = await sendEmail(user.email, code);

        if (response.error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't send mail. Please try again later.",
            });
        }

        let expiry = Date.now() + 60 * 1000 * 15;
        user.resetPasswordToken = code;
        user.resetPasswordExpires = expiry; // 15 minutes

        await user.save();

        return res.send({
            success: true,
            message:
                "If that email address is in our database, we will send you an email to reset your password",
        });
    } catch (error) {
        console.error("forgot-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

export const ResetPassword = async (req, res) => {
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
    } catch (error) {
        console.error("reset-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

export const ReferredAccounts = async (req, res) => {
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
    } catch (error) {
        console.error("fetch-referred-error.", error);
        return res.stat(500).json({
            error: true,
            message: error.message,
        });
    }
};

export const Logout = async (req, res) => {
    try {
        const { id } = req.decoded;

        let user = await User.findOne({ userId: id });

        user.accessToken = "";

        await user.save();

        return res.send({ success: true, message: "User Logged out" });
    } catch (error) {
        console.error("user-logout-error", error);
        return res.stat(500).json({
            error: true,
            message: error.message,
        });
    }
};



// ===PASSWORD RECOVER AND RESET

// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
export const recover = async (req, res) => {
    User.findOne({email: req.body.email})
        .then(async user => {
            if (!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

            //Generate and set password reset token
            generatePasswordReset()

            let code = Math.floor(100000 + Math.random() * 900000);
            let expiry = Date.now() + 60 * 1000 * 15;
            user.resetPasswordToken = code;
            user.resetPasswordExpires = expiry; // 15 minutes


            // Save the updated user object
            await user.save()
                .then(async user => {
                    const action = "reset";
                    // send email
                    let link = process.env.BASE_HOST + "/api/v1/users/auth/reset?passwordResetToken=" + user.resetPasswordToken;

                    await sendEmail(user.email, this.resetPasswordToken, action, link).then(() => {
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
export const reset = (req, res) => {
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
export const resetPassword = (req, res) => {
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


export function generatePasswordReset () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
}
