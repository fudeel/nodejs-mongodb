import Joi from "joi";
import {User} from "../../schemas/user-schema";
import {Request, Response} from "express";
import {CustomResponse} from "../../models/CustomResponse";
import * as mongoose from "mongoose";

const uploadProfilePictureSchema = Joi.object().keys({
    pic: Joi.string().required().custom((value, helpers) => {
        const buffer = Buffer.from(value, 'base64');
        if (buffer.length > 2100000) {
            return helpers.error('string.base64ImageSize');
        }
        return value;
    }).error((errors: any) => {
        errors.forEach((err) => {
            if (err.type === 'string.base64ImageSize') {
                err.message = `Base64 image exceeded the maximum size of ${2100000} bytes`;
            }
        });
        return errors;
    }),
    _id: Joi.string().required()
});

export const uploadProfilePicture= async (req: Request, res: Response) => {
    console.log('>  updating profile picture')
    if (req.headers['accesstoken'] !== null && req.headers['accesstoken'] !== '') {
        try {
            if (req.headers['accesstoken']) {
                const accesstoken = req.headers['accesstoken'].slice(7);
                await User.find({accesstoken}).exec(async (err, docs) => {
                    if (!err) {
                        // POST validation
                        const result = await uploadProfilePictureSchema.validate({pic: req.body.picUrl, _id: docs[0].userId});
                        if (result.error) {
                            res.status(500).send(<CustomResponse>{
                                error: true,
                                message: 'The image is exceeding size limit. Maximum size is 2MB',
                                status: 500
                            });
                        } else {
                            console.log('>  taking new profile picture url: ', req.body.picUrl)
                            const update = { pic: req.body.picUrl };
                            //const filter = { userId: docs[0].userId };
                            const _id = new mongoose.Types.ObjectId(docs[0]._id)
                            await User.findByIdAndUpdate(_id, update).then(() => {
                                res.status(200).send({error: false, message: 'Profile picture updated', code: 200});
                            }).catch(err => {
                                throw<CustomResponse> {
                                    error: true, message: err.message, code: 500
                                }
                            });
                        }

                    } else {
                        console.log('X  error in updating profile picture')
                        throw<CustomResponse> {
                            error: true, message: err.message, code: 500
                        }
                    }
                });
            }
        } catch (err: any) {
            res.status(err.status).send(err);
        }
    }
}
