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
    username: Joi.string().required().min(4).max(16),
    recaptchaKey: Joi.string().required(),
    version: Joi.string().required(),
    referrer: Joi.string(),
});

export const Signup = async (req: Request, res: Response, next: () => void) => {
    console.log('>  Signup');
    try {

        console.log('>  validating user schema');
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
            console.log('>  checking if email already exists');
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
                    console.log('>  checking if username already exists')
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
                            console.log('>  hashing the password')
                            const hash = await hashPassword(result.value.password);


                            //Generate unique id for the user.
                            result.value.userId = v4();

                            delete result.value.confirmPassword;
                            result.value.password = hash;

                            console.log('>  generating activation code')
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

                            console.log('>  No errors.')
                            res.status(200).send(<CustomResponse>{
                                error: false,
                                success: true,
                                message: 'User registered successfully',
                                status: 200,
                                accessToken: newUser.accessToken
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