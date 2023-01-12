import {Response} from "express";
import {findUser} from "../../utils/find-user";
import {comparePasswords} from "../../schemas/user-schema";
import {generateJwt} from "../../utils/generateJwt";
import {CustomResponse} from "../../models/CustomResponse";

export const Login = async (req: any, res: Response) => {
    console.table({
        email: req.body.email,
        password: req.body.password
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