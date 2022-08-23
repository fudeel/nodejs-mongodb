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
                res.send(r.data);
            })
            .catch(error => {
                console.error(error);
            });

    } catch (err) {
        console.log('Catch error: ', err);
        res.send(err);
    }
};
