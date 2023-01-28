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
exports.Signup = void 0;
const user_schema_1 = require("../../schemas/user-schema");
const uuid_1 = require("uuid");
const activate_account_1 = require("../../utils/activate-account");
const nanoid_1 = require("nanoid");
const joi_1 = __importDefault(require("joi"));
const CHARACTER_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const referralCode = (0, nanoid_1.customAlphabet)(CHARACTER_SET, 8);
//Validate user schema
const userSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email({ minDomainSegments: 2 }),
    password: joi_1.default.string().required().min(4),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
    username: joi_1.default.string().required().min(6).max(16).pattern(/^[a-zA-Z0-9_]*$/),
    recaptchaKey: joi_1.default.string().required(),
    version: joi_1.default.string().required(),
    referrer: joi_1.default.string(),
});
const Signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userSchema.validate(req.body);
        if (result.error) {
            const customResponse = {
                error: true,
                message: result.error.message.toString(),
                status: 500,
                forceLogout: false
            };
            return res.status(500).send(customResponse);
        }
        else {
            yield user_schema_1.User.findOne({
                email: result.value.email,
            }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
                if (user) {
                    throw {
                        error: true,
                        message: "Email already exists.",
                        status: 500,
                        forceLogout: false
                    };
                }
                else {
                    yield user_schema_1.User.findOne({
                        username: result.value.username,
                    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
                        if (user) {
                            throw {
                                error: true,
                                message: "username already exists.",
                                status: 500,
                                forceLogout: false
                            };
                        }
                        else {
                            const hash = yield (0, user_schema_1.hashPassword)(result.value.password);
                            //Generate unique id for the user.
                            result.value.userId = (0, uuid_1.v4)();
                            delete result.value.confirmPassword;
                            result.value.password = hash;
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
                            yield newUser.save().then(() => {
                                console.log('>  user should be saved in the DB... ');
                            }).catch(err => {
                                console.log('X  error on saving user on DB: ', err);
                            });
                            res.status(200).send({
                                error: false,
                                success: true,
                                message: 'User registered successfully',
                                status: 200,
                                accesstoken: newUser.accesstoken
                            });
                        }
                    }));
                }
            }));
        }
    }
    catch (error) {
        console.error("Catch error in Signup: ", error);
        res.status(error.status).send(error);
    }
});
exports.Signup = Signup;
//# sourceMappingURL=register.js.map