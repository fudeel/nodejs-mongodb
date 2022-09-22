import axios from "axios";
import {GOOGLE_API_BASE_URL} from "../../utils/constants.js";
import {Signup} from "../user/user.controller.js";
import {verifyIdToken} from "../../utils/verify-token.js";
import {recaptchaV2Verification} from "../../utils/recaptcha-v2-verification.js";

const accountURL = '/accounts';

export const LoginWithEmailAndPassword = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true
    }
    try {
        await axios
            .post(GOOGLE_API_BASE_URL + accountURL + ":signInWithPassword"+"?key=" +process.env.OAUTH_CLIENT_ID, data)
            .then(r => {
                res.send(r.data);
            })
            .catch(error => {
                console.error(error);
                res.send("User not found or incorrect email/password. ");
            });

    } catch (err) {
        res.send(err);
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

    console.log('DATA: ', data);

    const recaptcha = await recaptchaV2Verification(data.recaptchaKey).then(res => {
        return res;
    }).catch((err) => {
        return err;
    });

    console.log('RECAPTCHA: ', recaptcha);

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
                .then((res) => {
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
    try {
        await verifyIdToken(req, res, next)
    } catch (e) {
        console.log('Error on verify authentication token: ', e);
        res.status(403).send(false)
    }
}
