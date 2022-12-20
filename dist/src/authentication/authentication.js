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
exports.getCurrentUserInfo = exports.sendNewActivationCode = exports.VerifyAuthenticationToken = exports.RegisterWithEmailAndPassword = exports.LoginWithEmailAndPassword = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../utils/constants");
const user_controller_1 = require("../user/user.controller");
const verify_token_1 = require("../../utils/verify-token");
const recaptcha_verification_1 = require("../../utils/recaptcha-verification");
const joi_1 = __importDefault(require("joi"));
const find_user_1 = require("../../utils/find-user");
const user_schema_1 = require("../../schemas/user-schema");
const accountURL = '/accounts';
const LoginWithEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true
    };
    if (data.email !== null && data.email !== '' && data.password !== null && data.password !== '')
        try {
            yield axios_1.default
                .post(constants_1.GOOGLE_API_BASE_URL + accountURL + ":signInWithPassword" + "?key=" + process.env.OAUTH_CLIENT_ID, data)
                .then(r => {
                console.log(`user ${data.email} connected successfully with Google oatuh`);
                const googleIdToken = r.data['idToken'];
                (0, user_controller_1.Login)(req, res, googleIdToken).then(() => {
                    console.log(`user ${data.email} connected successfully with Sangrya`);
                });
            })
                .catch((error) => {
                console.error("Google login error: possible error -> User not found or incorrect email/password: ", error);
                res.send("User not found or incorrect email/password. ");
            });
        }
        catch (err) {
            console.log('generic error in try-catch login with username and password: ', err);
            res.send(err);
        }
    else {
        res.send({ error: true, message: 'Incorrect email or password' });
    }
});
exports.LoginWithEmailAndPassword = LoginWithEmailAndPassword;
const RegisterWithEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username,
        recaptchaKey: req.body.recaptchaKey,
        returnSecureToken: true
    };
    const recaptcha = yield (0, recaptcha_verification_1.recaptchaVerification)(data.recaptchaKey, 'v2').then((res) => {
        return res;
    }).catch((err) => {
        return err;
    });
    if (recaptcha.success)
        yield (0, user_controller_1.Signup)(req, res).then((r) => __awaiter(void 0, void 0, void 0, function* () {
            if ((yield r) && (r === null || r === void 0 ? void 0 : r.statusCode) !== 500) {
                axios_1.default.post(constants_1.GOOGLE_API_BASE_URL + accountURL + ":signUp" + "?key=" + process.env.OAUTH_CLIENT_ID, JSON.stringify({
                    email: data.email,
                    password: data.password,
                    returnSecureToken: data.returnSecureToken
                }), {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(() => {
                    console.log('New user created with email: ', data.email);
                })
                    .catch(error => {
                    console.error("Google API error: ", error);
                });
            }
        }));
    else {
        console.log('Recaptcha not valid for user: ', data.email);
        res.send({ error: true, message: 're-captcha not valid' });
    }
});
exports.RegisterWithEmailAndPassword = RegisterWithEmailAndPassword;
const VerifyAuthenticationToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['idtoken'] !== null && req.headers['idtoken'] !== '') {
        try {
            yield (0, verify_token_1.verifyIdToken)(req, res, next);
        }
        catch (e) {
            res.status(403).send(false);
        }
    }
});
exports.VerifyAuthenticationToken = VerifyAuthenticationToken;
const sendNewActivationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activationEmailSchema = joi_1.default.object().keys({
        email: joi_1.default.string().email({ minDomainSegments: 2 }).required()
    });
    const result = yield activationEmailSchema.validate(req.body);
    if (result.error) {
        return res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }
    yield (0, find_user_1.findUser)(req.body.email, res, true);
});
exports.sendNewActivationCode = sendNewActivationCode;
const getCurrentUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            if (req.headers['authorization']) {
                const accessToken = req.headers['authorization'].slice(7);
                yield user_schema_1.User.find({ accessToken }).select('username pic role sellingItems isCertified').exec((err, docs) => {
                    if (!err) {
                        res.status(200).send(docs);
                    }
                    else {
                        res.status(500).send({ error: true, message: err.message, code: 500 });
                    }
                });
            }
        }
        catch (error) {
            console.log('ERROR in generate user info: ', error);
        }
    }
    else {
        console.log('Error in generate user info: Authorization code not valid or undefined');
        res.status(500).send({
            error: true,
            message: 'Authorization code invalid or missing',
            code: 500
        });
    }
});
exports.getCurrentUserInfo = getCurrentUserInfo;
//# sourceMappingURL=authentication.js.map