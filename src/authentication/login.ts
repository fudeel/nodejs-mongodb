import {Request, Response} from "express";
import axios from "axios";
import {accountURL, GOOGLE_API_BASE_URL} from "../../utils/constants";
import {findUser} from "../../utils/find-user";
import {comparePasswords} from "../../schemas/user-schema";
import {generateJwt} from "../../utils/generateJwt";

export const Login = async (req: Request, res: Response, googleIdToken: string) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }


        const user = await findUser(email, res, false);

        //3. Verify the password is valid
        const isValid = await comparePasswords(password, user.password);



        if (!isValid) {
            return res.status(400).json({
                error: true,
                message: "Invalid credentials",
            });
        }

        //Generate Access token

        const { error, token } = await generateJwt(user.email, user.userId);
        if (error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't create access token. Please try again later",
            });
        }
        user.accessToken = token;
        await user.save();

        //Success
        return res.send({
            success: true,
            message: "User logged in successfully",
            accessToken: token,
            idToken: googleIdToken
        });
    } catch (err) {
        console.error("Login error try-catch", err);
    }
};

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
