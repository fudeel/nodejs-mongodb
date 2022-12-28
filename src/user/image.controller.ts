import Joi from "joi";
import {User} from "../../schemas/user-schema";
import {Request, Response} from "express";
import {CustomResponse} from "../../models/CustomResponse";
import * as mongoose from "mongoose";

const uploadProfilePictureSchema = Joi.object().keys({
    pic: Joi.string().required(),
    _id: Joi.string().required()
});

export const uploadProfilePicture= async (req: Request, res: Response) => {
    console.log('>  updating profile picture: ', req.body);
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            if (req.headers['authorization']) {
                const accessToken = req.headers['authorization'].slice(7);
                await User.find({accessToken}).exec(async (err, docs) => {
                    if (!err) {
                        // POST validation
                        const result = await uploadProfilePictureSchema.validate({pic: req.body.picUrl, _id: docs[0].userId});

                        if (result.error) {
                            throw<CustomResponse> {
                                error: true,
                                message: result.error.message.toString(),
                                status: 500
                            }
                        } else {
                            console.log('aaaa: ', result);

                            const update = { pic: req.body.picUrl };
                            //const filter = { userId: docs[0].userId };
                            console.log('ID BEFORE TRANSFORMING: ', docs[0]._id);
                            const _id = new mongoose.Types.ObjectId(docs[0]._id)
                            console.log('>  trying to write on db')
                            await User.findByIdAndUpdate(_id, update).then(() => {
                                console.log('>  profile picture updated on db')
                                res.status(200).send({error: false, message: 'Profile picture updated', code: 200});
                            }).catch(err => {
                                console.log('X  Error in updating profile picture on db: ', err);
                                throw<CustomResponse> {
                                    error: true, message: err.message, code: 500
                                }
                            });
                        }

                    } else {
                        throw<CustomResponse> {
                            error: true, message: err.message, code: 500
                        }
                    }
                });
            }
        } catch (err: any) {
            console.log('Error in uploading user picture: ', err);
            res.status(err.status).send(err);
        }
    }
}
