import Joi from "joi";
import {Response} from "express";
import {CustomResponse} from "../../models/CustomResponse";
import mongoose from "mongoose";
import {User} from "../../schemas/user-schema";
import {SocialNetworkModel} from "../../models/user/social-network-model";
import {BecomeSellerSchema} from "../../schemas/become-seller-schema";

const updateBasicInfoSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string().pattern(/^\+?\d{12}$/).allow(null, ''),
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
    isDelete: Joi.bool().default(false).required(),
    selectedSocial: Joi.string().min(5).required(),
    socialProfile: Joi.string().allow(null).min(5),
    _id: Joi.string().required()
});

const updateBecomeSellerRequestSchema = Joi.object().keys({
    requesterId: Joi.string().required()
});



export const UpdateBasicInfo = async (req: any, res: Response) => {

    console.log('> updating user data')
    req.body._id = req.decoded.id;

    const result = await updateBasicInfoSchema.validate(req.body);

    console.log('> checking errors')
    if (result.error) {
        console.log('x error')
        const customResponse: CustomResponse = {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        }
        return res.status(500).send(customResponse);
    } else {

        console.log('> no errors')
        const _id = new mongoose.Types.ObjectId(req.user._id)
        const update = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone};

        await User.findByIdAndUpdate(_id, update).then(() => {
            res.status(200).send(<CustomResponse>{error: false, message: 'basic info updated', code: 200});
        }).catch(err => {
            console.log('x error in updating user data')
            res.status(500).send(<CustomResponse>{error: true, message: err.message, code: 500});
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

    try {
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
            const selectedSocial = req.body.selectedSocial

            const update = {
                socialNetwork: <SocialNetworkModel>{
                    instagram: {
                        profile: updateProfile(req.body.isDelete, selectedSocial, 'instagram', req.user.socialNetwork.instagram, req.body.socialProfile).profile,
                        status: updateProfile(req.body.isDelete, selectedSocial, 'instagram', req.user.socialNetwork.instagram, req.body.socialProfile).status
                    },
                    tiktok: {
                        profile: updateProfile(req.body.isDelete, selectedSocial, 'tiktok', req.user.socialNetwork.tiktok, req.body.socialProfile).profile,
                        status: updateProfile(req.body.isDelete, selectedSocial, 'tiktok', req.user.socialNetwork.tiktok, req.body.socialProfile).status
                    },
                    twitch: {
                        profile: updateProfile(req.body.isDelete, selectedSocial, 'twitch', req.user.socialNetwork.twitch, req.body.socialProfile).profile,
                        status: updateProfile(req.body.isDelete, selectedSocial, 'twitch', req.user.socialNetwork.twitch, req.body.socialProfile).status
                    },
                    twitter: {
                        profile: updateProfile(req.body.isDelete, selectedSocial, 'twitter', req.user.socialNetwork.twitter, req.body.socialProfile).profile,
                        status: updateProfile(req.body.isDelete, selectedSocial, 'twitter', req.user.socialNetwork.twitter, req.body.socialProfile).status
                    },
                }
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
    } catch (error) {
        return res.status(400).send(error.message);
    }
};


export const UpdateBecomeSellerRequest = async (req: any, res: Response) => {

    try {
        req.body._id = req.decoded.id;
        const isDelete = req.body.isDelete;

        const requesterId = req.body._id

        const result = await updateBecomeSellerRequestSchema.validate({requesterId: requesterId});

        if (result.error) {
            throw<CustomResponse>{
                error: true,
                message: result.error.message.toString(),
                status: 500,
                forceLogout: true
            }
        } else {

            if (isDelete) {
                console.log("> deleting become a seller request");

                const _id = new mongoose.Types.ObjectId(req.user._id);
                if (req.user.becomeSellerRequest === 'PENDING' && req.user.becomeSellerRequest !== 'DENIED' ) {
                    const updateBecomeSellerRequest = {
                        becomeSellerRequest: null
                    }

                    console.log('> updating user _id: ', _id, ' with: ', updateBecomeSellerRequest, ' data.');

                    await User.findByIdAndUpdate(_id, updateBecomeSellerRequest).then(() => {

                        res.status(200).send(<CustomResponse>{
                            error: false,
                            message: 'become seller request updated',
                            code: 200
                        });
                    })
                } else {
                    res.status(401).send(<CustomResponse>{error: true, message: 'user has no pending request', code: 401});
                }
            } else {
                const _id = new mongoose.Types.ObjectId(req.user._id)

                if (req.user.becomeSellerRequest !== 'PENDING' && req.user.becomeSellerRequest !== 'DENIED' ) {
                    const updateBecomeSellerRequest = {
                        becomeSellerRequest: 'PENDING'
                    }

                    const newBecomeSellerRequest = await new BecomeSellerSchema(result.value)
                    newBecomeSellerRequest.save().then(async () => {
                        console.log('> new become seller request created on DB');

                        await User.findByIdAndUpdate(_id, updateBecomeSellerRequest).then(() => {
                            res.status(200).send(<CustomResponse>{error: false, message: 'become seller request updated', code: 200});
                        })
                    }).catch(err => {
                        console.log('X  Error in creating new become seller request on DB: ', err);
                        res.status(400).send("There is already a request made from this user. If you are sure you did not have a pending request, contact the support team.");
                    })
                } else {
                    res.status(401).send(<CustomResponse>{error: true, message: 'user has already a pending or denied request', code: 401});
                }
            }
        }
    } catch (error) {
        console.log('error: ', error);
        res.status(error.status).send(error);
    }


};


export const DeleteBecomeSellerRequest = (req: any, res: Response, next: () => void) => {
    console.log('deleting request: ', req.decoded.id);
    const requesterId = req.decoded.id;
    if (req.user.becomeSellerRequest === 'PENDING') {

        BecomeSellerSchema.findOneAndDelete({requesterId: requesterId}, async (err, docs) => {
            if (err){
                console.log("find one and delete error", err);
                res.status(404).send(<CustomResponse>{
                    error: true,
                    message: 'No pending become a seller request',
                    status: 404
                })
            }
            else{
                console.log('> become a seller request deleted successfully')
                req.body.isDelete = true;

                next();
            }
        })
    } else {
        res.status(404).send(<CustomResponse>{
            error: true,
            message: 'No pending become a seller request',
            status: 404
        })
    }
};


function updateProfile(isDelete: boolean, selectedSocial: string, socialToChange: string, current: any, newSocial: string): {profile: string, status: 'PENDING' | 'VERIFIED' | 'DENIED' | null} {
    if (selectedSocial !== socialToChange) {
        // work around
        return {
            profile: current.profile,
            status: current.status
        }
    }

    if (isDelete) {
        return {
            profile: null,
            status: null
        }
    }

    if ((current.profile === null || current.profile === '') && (current.status === null || current.status === '')) {
        return {
            profile: newSocial,
            status: 'PENDING'
        }
    } else if (current['profile'] !== newSocial && current['status'] === 'VERIFIED') {
        return {
            profile: newSocial,
            status: 'PENDING'
        }
    } else if (current['profile'] === newSocial) {
        return {
            profile: current['profile'],
            status: current['status']
        }
    } else if (current['profile'] !== newSocial && current['status'] !== null) {
        return {
            profile: current['profile'],
            status: current['status']
        }
    }
    else {
        return {
            profile: null,
            status: null
        }
    }
}