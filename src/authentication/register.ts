import {Request, Response} from "express";
import {hashPassword, User} from "../../schemas/user-schema";
import {v4} from "uuid";
import {generateNewActivationCode} from "../../utils/activate-account";
import {customAlphabet} from "nanoid";
import Joi from "joi";
import {CustomResponse} from "../../models/CustomResponse";

const CHARACTER_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const referralCode = customAlphabet(CHARACTER_SET, 8);

//Validate user schema
const userSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(4),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    username: Joi.string().required().min(6).max(16).pattern(/^[a-zA-Z0-9_]*$/),
    recaptchaKey: Joi.string().required(),
    version: Joi.string().required(),
    referrer: Joi.string(),
});

export const Signup = async (req: Request, res: Response, next: () => void) => {
    try {
        const result = await userSchema.validate(req.body);
        if (result.error) {
            const customResponse: CustomResponse = {
                error: true,
                message: result.error.message.toString(),
                status: 500,
                forceLogout: false
            }
            return res.status(500).send(customResponse);
        } else {
            await User.findOne({
                email: result.value.email,
            }).then( async (user) => {
                if (user) {
                    throw<CustomResponse> {
                        error: true,
                        message: "Email already exists.",
                        status: 500,
                        forceLogout: false
                    }
                } else {
                    await User.findOne({
                        username: result.value.username,
                    }).then(async (user) => {
                        if (user) {
                            throw<CustomResponse> {
                                error: true,
                                message: "username already exists.",
                                status: 500,
                                forceLogout: false
                            }
                        } else {
                            const hash = await hashPassword(result.value.password);


                            //Generate unique id for the user.
                            result.value.userId = v4();

                            delete result.value.confirmPassword;
                            result.value.password = hash;

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
                            await newUser.save().then(() => {
                                console.log('>  user should be saved in the DB... ');
                            }).catch(err => {
                                console.log('X  error on saving user on DB: ', err);
                            });

                            res.status(200).send(<CustomResponse>{
                                error: false,
                                success: true,
                                message: 'User registered successfully',
                                status: 200,
                                accesstoken: newUser.accesstoken
                            })
                        }
                    });
                }
            });
        }

    } catch (error) {
        console.error("Catch error in Signup: ", error);
        res.status(error.status).send(error);
    }
};