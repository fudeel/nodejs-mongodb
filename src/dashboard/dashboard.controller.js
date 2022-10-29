import Joi from "joi";
import {User} from "../../schemas/user-schema.js";


const filterSchema = Joi.object().keys({
    roles: Joi.array().items(Joi.string()),
    username: Joi.string().optional()
});

export const GetUsersByFilter = async (req, res, googleIdToken) => {
    try {

        // POST validation
        const result = await filterSchema.validate(req.body);
        if (result.error) {
            return await res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }


        const filterBody = {}

        if (req.body.roles) filterBody.roles = req.body.roles;
        if (req.body.username) filterBody.username = req.body.username;

        console.log('filtered body: ', filterBody);


        User.find(filterBody).select('username pic roles sellingItems isCertified').exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            } else {
                res.status(500).send({error: true, message: err.message, code: err.code});
            }
        });




    } catch (err) {
        console.error("Login error try-catch", err);
    }
};
