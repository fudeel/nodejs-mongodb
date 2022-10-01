import Joi from "joi";
import {decodeToken} from "../../utils/decode-token.js";
import {findUser} from "../../utils/find-user.js";


export const checkUserActivation = async (req, res) => {

    const decodedEmail = await decodeToken(req.headers['idtoken']);

    console.log('decoded email: ', decodedEmail);

    const activationSchema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2 })
    });

    console.log("Let's check if the user is authenticated correctly and active");
    const result = await activationSchema.validate(req.body);

    if (result.error) {
        return await res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }


    if (!decodedEmail) {
        return res.status(400).json({
            error: true,
            message: "Email empty or not valid format",
        });
    }


    const user = await findUser(decodedEmail, res);

    res.status(200).send({
        status: 200,
        error: false,
        user: user
    })

}
