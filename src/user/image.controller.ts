import Joi from "joi";
import {User} from "../../schemas/user-schema";
import {Request, Response} from "express";

const uploadProfilePictureSchema = Joi.object().keys({
    picUrl: Joi.string().required(),
    _id: Joi.string().required()
});

export const uploadProfilePicture= async (req: Request, res: Response) => {
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            if (req.headers['authorization']) {
                const accessToken = req.headers['authorization'].slice(7);
                await User.find({accessToken}).exec(async (err, docs) => {
                    if (!err) {
                        // POST validation
                        const result = await uploadProfilePictureSchema.validate({picUrl: req.body.picUrl, _id: docs[0].userId});
                        if (result.error) {
                            return res.status(500).json({
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
                        res.status(500).send({error: true, message: err.message, code: 500});
                    }
                });
            }
        } catch (err: any) {
                console.log('Error in uploading user picture: ', err);
        }
    }
}
