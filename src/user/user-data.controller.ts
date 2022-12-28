import Joi, {string} from "joi";
import {Request, Response} from "express";
import axios from "axios";
import {accountURL, GOOGLE_API_BASE_URL} from "../../utils/constants";
import {Login} from "../authentication/login";
import {CustomResponse} from "../../models/CustomResponse";
import {decodeFirebaseToken} from "../../utils/decode-firebase-token";
import {findUser} from "../../utils/find-user";
import mongoose from "mongoose";
import {User} from "../../schemas/user-schema";

const updateBasicInfoSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string(),
    _id: Joi.string().required()
});


export const UpdateBasicInfo = async (req: any, res: Response) => {

    console.log('>  Checking user activation...');
    console.log('>  Checking mongodb token...: ', req.decoded);
    console.log('>  Checking firebase token...', req.firebaseDecoded);

    req.body._id = req.decoded.id;

    console.log('body: ', req.body);

    console.log('>  decoding...')

    console.log('>  Validating schema...')
    const result = await updateBasicInfoSchema.validate(req.body);

    if (result.error) {
        const customResponse: CustomResponse = {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
        return res.status(500).send(customResponse);
    } else {
        console.log('>  getting user...')
        await User.find(req.headers.accessToken).exec(async (err, docs) => {
            if (!err) {
                const _id = new mongoose.Types.ObjectId(docs[0]._id)
                const update = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, basicInfoAvailableToChange: false };
                console.log('>  trying to update on db')

                await User.findByIdAndUpdate(_id, update).then(() => {
                    console.log('>  basic info updated on db')
                    res.status(200).send({error: false, message: 'basic info updated', code: 200});
                }).catch(err => {
                    console.log('X  Error in updating basic info on db: ', err);
                    throw<CustomResponse>{
                        error: true, message: err.message, code: 500
                    }
                });
            }
        });
    }
};