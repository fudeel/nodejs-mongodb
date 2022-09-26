import axios from "axios";
import {GOOGLE_API_BASE_URL} from "../../utils/constants.js";
import {Login, Signup} from "../user/user.controller.js";
import {verifyIdToken} from "../../utils/verify-token.js";
import {recaptchaV2Verification} from "../../utils/recaptcha-v2-verification.js";
import Joi from "joi";
import {findUser} from "../../utils/find-user.js";

const accountURL = '/accounts';

export const LoginWithEmailAndPassword = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true
    }
    if (data.email !== null && data.email !== '' && data.password !== null && data.password !== '')
    try {
        await axios
            .post(GOOGLE_API_BASE_URL + accountURL + ":signInWithPassword"+"?key=" +process.env.OAUTH_CLIENT_ID, data)
            .then(r => {
                console.log(`user ${data.email} connected successfully with Google oatuh`)
                const googleIdToken = r.data['idToken'];
                Login(req, res, googleIdToken).then(() => {
                    console.log(`user ${data.email} connected successfully with Sangrya`)
                });
            })
            .catch((error) => {
                console.error("Google login error: possible error -> User not found or incorrect email/password.");
                res.send("User not found or incorrect email/password. ");
            });

    } catch (err) {
        console.log('generic error in try-catch login with username and password: ', err);
        res.send(err);
    } else {
        res.send({error: true, message: 'Incorrect email or password'});
    }
};


export const RegisterWithEmailAndPassword = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username,
        recaptchaKey: req.body.recaptchaKey,
        returnSecureToken: true
    }

    const recaptcha = await recaptchaV2Verification(data.recaptchaKey).then(res => {
        return res;
    }).catch((err) => {
        return err;
    });

    if (recaptcha.success)
    await Signup(req, res).then(async (r) => {
        if (await r && r.statusCode !== 500) {
            axios.post(GOOGLE_API_BASE_URL + accountURL + ":signUp"+"?key=" +process.env.OAUTH_CLIENT_ID, JSON.stringify({
                email: data.email,
                password: data.password,
                returnSecureToken: data.returnSecureToken
            }), {
                headers: {
                    "Content-Type": "application/json",
                }})
                .then(() => {
                    console.log('New user created with email: ', data.email);
                })
                .catch(error => {
                    console.error("Google API error: ", error);
                });
        }
    });
    else {
        console.log('Recaptcha not valid for user: ', data.email);
        res.send({error: true, message: 're-captcha not valid'})
    }

}

export const VerifyAuthenticationToken = async (req, res, next) => {
    if (req.headers['idtoken'] !== null && req.headers['idtoken'] !== '') {
        try {
            await verifyIdToken(req, res, next);
        } catch (e) {
            res.status(403).send(false)
        }
    }
}


export const sendNewActivationCode = async (req, res) => {
    const activationEmailSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 }).required()
    });

    const result = await activationEmailSchema.validate(req.body);

    if (result.error) {
        return await res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }

    await findUser(req.body.email, res, true);
}
