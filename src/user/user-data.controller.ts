import Joi, {string} from "joi";
import {Request, Response} from "express";
import {CustomResponse} from "../../models/CustomResponse";
import mongoose from "mongoose";
import {User} from "../../schemas/user-schema";

const updateBasicInfoSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string(),
    _id: Joi.string().required()
});

const shippingInfoSchema = Joi.object().keys({
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    streetOne: Joi.string().required(),
    streetTwo: Joi.string().optional().allow(''),
    _id: Joi.string().required()
});


export const UpdateBasicInfo = async (req: any, res: Response) => {

    console.log('>  Checking user activation...');
    console.log('>  Checking mongodb token...: ', req.decoded);
    console.log('>  Checking firebase token...', req.firebaseDecoded);

    req.body._id = req.decoded.id;


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
        await User.find(req.headers.accessToken).exec().then(async (docs) => {
            console.log('docs: ', docs[0].basicInfoAvailableToChange, ' body: ', req.body.basicInfoAvailableToChange);
            const _id = new mongoose.Types.ObjectId(docs[0]._id)

            if (!docs[0].basicInfoAvailableToChange) {
                const customResponse: CustomResponse = {
                    error: true,
                    forceLogout: true,
                    message: 'Are you doing something that you are not allowed to do? Please open a ticket if you need help',
                    status: 401
                }
                return res.status(customResponse.status).send(customResponse);

            }

            const update = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, basicInfoAvailableToChange: false };
            console.log('>  trying to update on db')

            await User.findByIdAndUpdate(_id, update).then(() => {
                console.log('>  basic info updated on db')
                res.status(200).send(<CustomResponse>{error: false, message: 'basic info updated', code: 200});
            }).catch(err => {
                console.log('X  Error in updating basic info on db: ', err);
                throw<CustomResponse>{
                    error: true, message: err.message, code: 500
                }
            });
        }).catch(err => {
            res.status(401).send(<CustomResponse>{error: true, message: err.message, code: 401});
        })
    }
};

export const UpdateShippingAddressInfo = async (req: any, res: Response) => {

    console.log('>  Checking user activation...');
    req.body._id = req.decoded.id;
    console.log('>  decoding...')
    console.log('>  Validating schema...')
    const result = await shippingInfoSchema.validate(req.body);

    console.log('AAAA: ', result);

    if (result.error) {
        throw<CustomResponse>{
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
    } else {
        console.log('>  getting user...')
        await User.find(req.headers.accessToken).exec().then(async (docs) => {
            console.log('docs: ', docs[0].userMustInsertShippingAddress);
            const _id = new mongoose.Types.ObjectId(docs[0]._id)

            /*if (!docs[0].userMustInsertShippingAddress) {
                const customResponse: CustomResponse = {
                    error: true,
                    forceLogout: true,
                    message: 'Are you doing something that you are not allowed to do? Please open a ticket if you need help',
                    status: 401
                }
                return res.status(customResponse.status).send(customResponse);

            }*/

            const update = {
                address: {
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    zip: req.body.zip,
                    streetOne: req.body.streetOne,
                    streetTwo: req.body.streetTwo
                },
                userMustInsertShippingAddress: false };



            await User.findByIdAndUpdate(_id, update).then(() => {
                console.log('>  trying to update on db')
                console.log('>  shipping address info updated on db')
                res.status(200).send(<CustomResponse>{error: false, message: 'shipping address info updated', code: 200});
            }).catch(err => {
                console.log('X  Error in updating basic info on db: ', err);
                const customResponse: CustomResponse = {
                    error: true,
                    forceLogout: true,
                    message: err.message,
                    status: 500
                }
                return res.status(customResponse.status).send(customResponse);
            });
        }).catch(err => {
            res.status(401).send(<CustomResponse>{error: true, message: err.message, code: 401});
        })
    }
};