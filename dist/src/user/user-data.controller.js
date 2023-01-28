"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBecomeSellerRequest = exports.UpdateSocialNetwork = exports.UpdateShippingAddressInfo = exports.UpdateBasicInfo = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = require("../../schemas/user-schema");
const updateBasicInfoSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    phone: joi_1.default.string(),
    _id: joi_1.default.string().required()
});
const shippingInfoSchema = joi_1.default.object().keys({
    country: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zip: joi_1.default.string().required(),
    streetOne: joi_1.default.string().required(),
    streetTwo: joi_1.default.string().optional().allow(''),
    _id: joi_1.default.string().required()
});
const updateSocialNetworkSchema = joi_1.default.object().keys({
    form: joi_1.default.object().keys({
        instagram: joi_1.default.string().optional().allow(''),
        tiktok: joi_1.default.string().optional().allow(''),
        twitch: joi_1.default.string().optional().allow(''),
        twitter: joi_1.default.string().optional().allow('')
    }),
    isAskingBecomeSeller: joi_1.default.boolean().required().default(false),
    _id: joi_1.default.string().required()
});
const updateBecomeSellerRequestSchema = joi_1.default.object().keys({
    isAskingBecomeSeller: joi_1.default.boolean().required().default(false),
    _id: joi_1.default.string().required()
});
const UpdateBasicInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('> updating user data');
    req.body._id = req.decoded.id;
    const result = yield updateBasicInfoSchema.validate(req.body);
    console.log('> checking errors');
    if (result.error) {
        console.log('x error');
        const customResponse = {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        };
        return res.status(500).send(customResponse);
    }
    else {
        console.log('> no errors');
        if (!req.user.basicInfoAvailableToChange) {
            console.log('> user already requested');
            const customResponse = {
                error: true,
                forceLogout: true,
                message: 'Are you doing something that you are not allowed to do? Please open a ticket if you need help',
                status: 401
            };
            return res.status(customResponse.status).send(customResponse);
        }
        const _id = new mongoose_1.default.Types.ObjectId(req.user._id);
        const update = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, basicInfoAvailableToChange: false };
        yield user_schema_1.User.findByIdAndUpdate(_id, update).then(() => {
            res.status(200).send({ error: false, message: 'basic info updated', code: 200 });
        }).catch(err => {
            console.log('x error in updating user data');
            res.status(500).send({ error: true, message: err.message, code: 500 });
        });
    }
});
exports.UpdateBasicInfo = UpdateBasicInfo;
const UpdateShippingAddressInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body._id = req.decoded.id;
    const result = yield shippingInfoSchema.validate(req.body);
    if (result.error) {
        throw {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        };
    }
    else {
        const _id = new mongoose_1.default.Types.ObjectId(req.user._id);
        const update = {
            address: {
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                zip: req.body.zip,
                streetOne: req.body.streetOne,
                streetTwo: req.body.streetTwo
            },
            userMustInsertShippingAddress: false
        };
        yield user_schema_1.User.findByIdAndUpdate(_id, update).then(() => {
            res.status(200).send({ error: false, message: 'shipping address info updated', code: 200 });
        }).catch(err => {
            const customResponse = {
                error: true,
                forceLogout: true,
                message: err.message,
                status: 500
            };
            return res.status(customResponse.status).send(customResponse);
        });
    }
});
exports.UpdateShippingAddressInfo = UpdateShippingAddressInfo;
const UpdateSocialNetwork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body._id = req.decoded.id;
    const result = yield updateSocialNetworkSchema.validate(req.body);
    if (result.error) {
        throw {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        };
    }
    else {
        const _id = new mongoose_1.default.Types.ObjectId(req.user._id);
        const update = {
            socialNetwork: {
                instagram: req.body.form.instagram,
                tiktok: req.body.form.tiktok,
                twitch: req.body.form.twitch,
                twitter: req.body.form.twitter,
            },
        };
        yield user_schema_1.User.findByIdAndUpdate(_id, update).then(() => {
            res.status(200).send({ error: false, message: 'social network updated', code: 200 });
        }).catch(err => {
            const customResponse = {
                error: true,
                forceLogout: true,
                message: err.message,
                status: 500
            };
            return res.status(customResponse.status).send(customResponse);
        });
    }
});
exports.UpdateSocialNetwork = UpdateSocialNetwork;
const UpdateBecomeSellerRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body._id = req.decoded.id;
    const result = yield updateBecomeSellerRequestSchema.validate(req.body);
    if (result.error) {
        throw {
            error: true,
            message: result.error.message.toString(),
            status: 500,
            forceLogout: true
        };
    }
    else {
        const _id = new mongoose_1.default.Types.ObjectId(req.user._id);
        if (req.user.becomeSellerRequest !== 'PENDING' && req.user.becomeSellerRequest !== 'DENIED') {
            const updateBecomeSellerRequest = {
                becomeSellerRequest: req.body.isAskingBecomeSeller ? 'PENDING' : null
            };
            yield user_schema_1.User.findByIdAndUpdate(_id, updateBecomeSellerRequest).then(() => {
                res.status(200).send({ error: false, message: 'become seller request updated', code: 200 });
            });
        }
        else {
            res.status(401).send({ error: true, message: 'user has already a pending or denied request', code: 401 });
        }
    }
});
exports.UpdateBecomeSellerRequest = UpdateBecomeSellerRequest;
//# sourceMappingURL=user-data.controller.js.map