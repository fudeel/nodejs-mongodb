import Joi, {string} from "joi";
import {Request, Response} from "express";
import {CustomResponse} from "../../models/CustomResponse";
import mongoose from "mongoose";
import {User} from "../../schemas/user-schema";
import {SocialNetworkModel} from "../../models/user/social-network-model";

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

const updateSocialNetworkSchema = Joi.object().keys({
    form: Joi.object().keys({
        instagram: Joi.string().optional().allow(''),
        tiktok: Joi.string().optional().allow(''),
        twitch: Joi.string().optional().allow(''),
        twitter: Joi.string().optional().allow('')
    }),
    isAskingBecomeSeller: Joi.boolean().required().default(false),
    _id: Joi.string().required()
});

const updateBecomeSellerRequestSchema = Joi.object().keys({
    isAskingBecomeSeller: Joi.boolean().required().default(false),
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

export const UpdateSocialNetwork = async (req: any, res: Response) => {

    console.log('SOCIAL NETWORK UPDATE BODY: ', req.body);
    console.log('>  Checking user activation...');
    req.body._id = req.decoded.id;
    console.log('>  decoding...')
    console.log('>  Validating schema...')
    const result = await updateSocialNetworkSchema.validate(req.body);

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

            const update = {
                socialNetwork: <SocialNetworkModel>{
                    instagram: req.body.form.instagram,
                    tiktok: req.body.form.tiktok,
                    twitch: req.body.form.twitch,
                    twitter: req.body.form.twitter,
                },
            };


            console.log('>  trying to update on db')
            await User.findByIdAndUpdate(_id, update).then(() => {
                console.log('>  social network updated on db')
                res.status(200).send(<CustomResponse>{error: false, message: 'social network updated', code: 200});
            }).catch(err => {
                console.log('X  Error in updating social network db: ', err);
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


export const UpdateBecomeSellerRequest = async (req: any, res: Response) => {

    console.log('Become seller request body: ', req.body);
    console.log('>  Checking user activation...');
    req.body._id = req.decoded.id;
    console.log('>  decoding...')
    console.log('>  Validating schema...')
    const result = await updateBecomeSellerRequestSchema.validate(req.body);

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
            const _id = new mongoose.Types.ObjectId(docs[0]._id)

            if (docs[0].becomeSellerRequest !== 'PENDING' && docs[0].becomeSellerRequest !== 'DENIED' ) {
                const updateBecomeSellerRequest = {
                    becomeSellerRequest: req.body.isAskingBecomeSeller ? 'PENDING' : null
                }

                console.log('>  user has no pending or denied request')

                await User.findByIdAndUpdate(_id, updateBecomeSellerRequest).then(() => {
                    console.log('>  become seller request updated on db')
                    res.status(200).send(<CustomResponse>{error: false, message: 'become seller request updated', code: 200});
                })
            } else {
                console.log('>  user has already a pending or denied request')
                throw <CustomResponse> {error: true, message: 'user has already a pending or denied request', code: 401}
            }

        }).catch(err => {
            res.status(err.code).send(<CustomResponse>{error: true, message: err.message, code: 500});
        })
    }
};
