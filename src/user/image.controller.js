

//Validate user schema
import Joi from "joi";
import {User} from "../../schemas/user-schema.js";

const uploadProfilePictureSchema = Joi.object().keys({
    picUrl: Joi.string().required(),
    _id: Joi.string().required()
});

export const uploadProfilePicture= async (req, res) => {
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            const accessToken = req.headers['authorization'].slice(7);


            await User.find({accessToken}).select().exec(async (err, docs) => {
                if (!err) {
                    // POST validation
                    const result = await uploadProfilePictureSchema.validate({picUrl: req.body.picUrl, _id: docs[0].userId});
                    if (result.error) {
                        return await res.status(500).json({
                            error: true,
                            message: result.error.message.toString()
                        });
                    }

                    const updatePic = {
                        $set: {
                            pic: req.body.picUrl
                        },
                    };

                    await User.updateOne(result, updatePic);

                    res.status(200).send({error: false, message: 'Profile picture updated', code: 200});

                } else {
                    res.status(500).send({error: true, message: err.message, code: err.code});
                }
            });



        } catch (e) {

        }
    }
}
