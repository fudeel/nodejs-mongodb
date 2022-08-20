require("dotenv").config();
const axios = require('axios');
const {GOOGLE_API_BASE_URL} = require("../../utils/constants");

const accountURL = '/accounts';

exports.LoginWithEmailAndPassword = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true
    }
    try {
        const axios = require('axios');

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
