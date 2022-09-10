import axios from "axios";
import {GOOGLE_API_BASE_URL} from "../../utils/constants.js";
import {Signup} from "../user/user.controller.js";
import * as stream from "stream";
import {verifyIdToken} from "../../utils/verify-token.js";

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
                console.log('Login successfully\n --:', r.data['email']);
                res.send(r.data);
            })
            .catch(error => {
                console.error(error);
                res.send("User not found or incorrect email/password. ");
            });

    } catch (err) {
        console.log('Catch error: ', err);
        res.send(err);
    }
};


export const RegisterWithEmailAndPassword = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username,
        returnSecureToken: true
    }

    await Signup(req, res).then(async (r) => {
        if (await r && r.statusCode !== 500) {
            axios.post(GOOGLE_API_BASE_URL + accountURL + ":signUp"+"?key=" +process.env.OAUTH_CLIENT_ID, data)
                .then(() => {
                    console.log('-- New user created with email: ', data.email);
                })
                .catch(error => {
                    console.error("-- ", error);
                });
        }
    });

}

export const VerifyAuthenticationToken = async (req, res, next) => {
    try {
        await verifyIdToken(req, res, next)
    } catch (e) {
        console.log('Error on verify authentication token: ', e);
        res.status(403).send(false)
    }
}
