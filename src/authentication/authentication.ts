import axios from "axios";
import {GOOGLE_API_BASE_URL} from "../../utils/constants";
import {Login, Signup} from "../user/user.controller";
import {verifyIdToken} from "../../utils/verify-token";
import {recaptchaVerification} from "../../utils/recaptcha-verification";
import Joi from "joi";
import {findUser} from "../../utils/find-user";
import {User} from "../../schemas/user-schema";
import {Request, Response} from "express";


const accountURL = '/accounts';

export const LoginWithEmailAndPassword = async (req: Request, res: Response) => {
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
            .catch((error: any) => {
                console.error("Google login error: possible error -> User not found or incorrect email/password: ", error);
                res.send("User not found or incorrect email/password. ");
            });

    } catch (err: any) {
        console.log('generic error in try-catch login with username and password: ', err);
        res.send(err);
    } else {
        res.send({error: true, message: 'Incorrect email or password'});
    }
};


export const RegisterWithEmailAndPassword = async (req: Request, res: Response) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username,
        recaptchaKey: req.body.recaptchaKey,
        returnSecureToken: true
    }

    console.log('>  registering with email and password');
    console.table(data);
    console.log('\n     ----    ----    \n');



    console.log('>  waiting for recaptcha verification v2 \n');
    const recaptcha = await recaptchaVerification(data.recaptchaKey, 'v2').then((res: any) => {
        console.table(res);
        console.log('\n     ----    ----    \n');
        return res;
    }).catch((err: any) => {
        console.log('X  error v2');
        console.table(res);
        console.log('\n     ----    ----    \n');
        return err;
    });

    if (recaptcha.success) {
        console.log('>  recaptcha valid. Let us continue with the registration');
        await Signup(req, res).then(async (r) => {

            console.log('>  saving data on Firebase db')
            if (await r && r?.statusCode !== 500) {
                axios.post(GOOGLE_API_BASE_URL + accountURL + ":signUp"+"?key=" +process.env.OAUTH_CLIENT_ID, JSON.stringify({
                    email: data.email,
                    password: data.password,
                    returnSecureToken: data.returnSecureToken
                }), {
                    headers: {
                        "Content-Type": "application/json",
                    }})
                    .then(() => {
                        console.log('>  New user created with email: ', data.email);
                    })
                    .catch(error => {
                        console.error("Google API error: ", error);
                    });
            }
        }).catch(err => {
            console.log('X  Error during Signup process: ', err);
        });
    }

    else {
        console.log('X  Recaptcha not valid for user: ', data.email);
        res.send({error: true, message: 're-captcha not valid'})
    }

}

export const VerifyAuthenticationToken = async (req: Request, res: Response, next: () => void) => {
    if (req.headers['idtoken'] !== null && req.headers['idtoken'] !== '') {
        try {
            await verifyIdToken(req, res, next);
        } catch (e) {
            res.status(403).send(false)
        }
    }
}


export const sendNewActivationCode = async (req: Request, res: Response) => {
    const activationEmailSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 }).required()
    });

    const result = await activationEmailSchema.validate(req.body);

    if (result.error) {
        return res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }

    await findUser(req.body.email, res, true);
}


export const getCurrentUserInfo = async (req: Request, res: Response) => {
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            if (req.headers['authorization']) {
                const accessToken = req.headers['authorization'].slice(7);
                await User.find({accessToken}).select('username pic role sellingItems isCertified').exec((err, docs) => {
                    if (!err) {
                        res.status(200).send(docs);
                    } else {
                        res.status(500).send({error: true, message: err.message, code: 500});
                    }
                });
            }

        } catch (error: any) {
            console.log('ERROR in generate user info: ', error);
        }
    } else {
        console.log('Error in generate user info: Authorization code not valid or undefined');
        res.status(500).send({
            error: true,
            message: 'Authorization code invalid or missing',
            code: 500
        })
    }
}