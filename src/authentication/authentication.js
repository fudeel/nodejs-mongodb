import axios from "axios";
import {GOOGLE_API_BASE_URL} from "../../utils/constants.js";
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
        returnSecureToken: true
    }
    try {
        await axios
            .post(GOOGLE_API_BASE_URL + accountURL + ":signUp"+"?key=" +process.env.OAUTH_CLIENT_ID, data)
            .then(r => {
                console.log('-- New user created with email: ', data.email);
                res.send(r.data);
            })
            .catch(error => {
                console.error("-- ", error);
                res.send("Email already used or there's an error in our systems.");
            });

    } catch (err) {
        console.log('There is an error on the system. Try later');
        res.send('There is an error on the system. Try later \n' + {err} );
    }
}
