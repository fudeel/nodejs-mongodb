import Joi from "joi";
import {Response} from "express";
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
    req.body._id = req.decoded.id;
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

        if (!req.user.basicInfoAvailableToChange) {
            const customResponse: CustomResponse = {
                error: true,
                forceLogout: true,
                message: 'Are you doing something that you are not allowed to do? Please open a ticket if you need help',
                status: 401
            }
            return res.status(customResponse.status).send(customResponse);
        }

        const accesstoken = req.headers.accesstoken.split(" ")[1];
        const _id = new mongoose.Types.ObjectId(req.user._id)
        const update = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, basicInfoAvailableToChange: false };

        await User.findByIdAndUpdate(_id, update).then(() => {
            res.status(200).send(<CustomResponse>{error: false, message: 'basic info updated', code: 200});
        }).catch(err => {
            throw<CustomResponse>{
                error: true, message: err.message, code: 500
            }
        });
    }
};

export const UpdateShippingAddressInfo = async (req: any, res: Response) => {


    req.body._id = req.decoded.id;
    const result = await shippingInfoSchema.validate(req.body);


    if (result.error) {
        throw<CustomResponse>{
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
    } else {
        const _id = new mongoose.Types.ObjectId(req.user._id)

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
            res.status(200).send(<CustomResponse>{error: false, message: 'shipping address info updated', code: 200});
        }).catch(err => {
            const customResponse: CustomResponse = {
                error: true,
                forceLogout: true,
                message: err.message,
                status: 500
            }
            return res.status(customResponse.status).send(customResponse);
        });
    }
};

export const UpdateSocialNetwork = async (req: any, res: Response) => {
    req.body._id = req.decoded.id;
    const result = await updateSocialNetworkSchema.validate(req.body);

    if (result.error) {
        throw<CustomResponse>{
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
    } else {
        const _id = new mongoose.Types.ObjectId(req.user._id)

        const update = {
            socialNetwork: <SocialNetworkModel>{
                instagram: req.body.form.instagram,
                tiktok: req.body.form.tiktok,
                twitch: req.body.form.twitch,
                twitter: req.body.form.twitter,
            },
        };


        await User.findByIdAndUpdate(_id, update).then(() => {
            res.status(200).send(<CustomResponse>{error: false, message: 'social network updated', code: 200});
        }).catch(err => {
            const customResponse: CustomResponse = {
                error: true,
                forceLogout: true,
                message: err.message,
                status: 500
            }
            return res.status(customResponse.status).send(customResponse);
        });
    }
};


export const UpdateBecomeSellerRequest = async (req: any, res: Response) => {

    req.body._id = req.decoded.id;
    const result = await updateBecomeSellerRequestSchema.validate(req.body);

    if (result.error) {
        throw<CustomResponse>{
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
    } else {
        const _id = new mongoose.Types.ObjectId(req.user._id)

        if (req.user.becomeSellerRequest !== 'PENDING' && req.user.becomeSellerRequest !== 'DENIED' ) {
            const updateBecomeSellerRequest = {
                becomeSellerRequest: req.body.isAskingBecomeSeller ? 'PENDING' : null
            }

            await User.findByIdAndUpdate(_id, updateBecomeSellerRequest).then(() => {
                res.status(200).send(<CustomResponse>{error: false, message: 'become seller request updated', code: 200});
            })
        } else {
            res.status(401).send(<CustomResponse>{error: true, message: 'user has already a pending or denied request', code: 401});
        }
    }
};
