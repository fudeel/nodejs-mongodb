import {Request, Response} from "express";
import axios from "axios";
import {accountURL, GOOGLE_API_BASE_URL} from "../../utils/constants";
import {findUser} from "../../utils/find-user";
import {comparePasswords} from "../../schemas/user-schema";
import {generateJwt} from "../../utils/generateJwt";
import {CustomResponse} from "../../models/CustomResponse";

export const Login = async (req: any, res: Response) => {
    console.table({
        email: req.body.email,
        password: req.body.password,
        idToken: req.body.idToken
    })
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const customResponse: CustomResponse = {
                error: true,
                message: "Cannot authorize user.",
                status: 500,
                forceLogout: false
            }
            return res.status(500).send(customResponse);
        }


        const user = await findUser(email, res, false);

        //3. Verify the password is valid
        const isValid = await comparePasswords(password, user.password);



        if (!isValid) {
            const customResponse: CustomResponse = {
                error: true,
                message: "Invalid credentials",
                status: 400,
                forceLogout: false
            }
            return res.status(400).send(customResponse);
        }

        //Generate Access token

        const { error, token } = await generateJwt(user.email, user.userId);
        if (error) {
            const customResponse: CustomResponse = {
                error: true,
                message: "Couldn't create access token. Please try again later",
                status: 500,
                forceLogout: false
            }
            return res.status(500).send(customResponse);
        }
        user.accessToken = token;
        await user.save();

        //Success
        const customResponse: CustomResponse = {
            error: false,
            message: "User logged in successfully",
            status: 200,
            forceLogout: false,
            success: true,
            accessToken: token,
            idToken: req.body.idToken
        }
        return res.status(200).send(customResponse);
    } catch (err) {
        console.error("Login error try-catch", err);
    }
};

export const GoogleLogin = async (req: Request | any, res: Response, next: () => void ) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true
    }

    console.log('logging in google system with these data');
    console.table(data);


    if (data.email !== null && data.email !== '' && data.password !== null && data.password !== '')
        try {
            await axios
                .post(GOOGLE_API_BASE_URL + accountURL + ":signInWithPassword"+"?key=" +process.env.OAUTH_CLIENT_ID, data)
                .then(r => {
                    req.idToken = r.data['idToken'];
                    next();
                })
                .catch(() => {
                    throw<CustomResponse> {
                        error: true,
                        status: 404,
                        message: 'User not found or incorrect email/password.'
                    }
                });

        } catch (err: any) {
            console.log('generic error in try-catch login with username and password: ', err);
            res.status(err.status).send(err);
        } else {
        console.log('error in login oatuh');
        res.status(400).send(<CustomResponse>{error: true, message: 'Incorrect email or password', status: 400});
    }
}