"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadProfilePicture = void 0;
const joi_1 = __importDefault(require("joi"));
const user_schema_1 = require("../../schemas/user-schema");
const mongoose = __importStar(require("mongoose"));
const uploadProfilePictureSchema = joi_1.default.object().keys({
    pic: joi_1.default.string().required().custom((value, helpers) => {
        const buffer = Buffer.from(value, 'base64');
        if (buffer.length > 2100000) {
            return helpers.error('string.base64ImageSize');
        }
        return value;
    }).error((errors) => {
        errors.forEach((err) => {
            if (err.type === 'string.base64ImageSize') {
                err.message = `Base64 image exceeded the maximum size of ${2100000} bytes`;
            }
        });
        return errors;
    }),
    _id: joi_1.default.string().required()
});
const uploadProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['accesstoken'] !== null && req.headers['accesstoken'] !== '') {
        try {
            if (req.headers['accesstoken']) {
                const accesstoken = req.headers['accesstoken'].slice(7);
                yield user_schema_1.User.find({ accesstoken }).exec((err, docs) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!err) {
                        // POST validation
                        const result = yield uploadProfilePictureSchema.validate({ pic: req.body.picUrl, _id: docs[0].userId });
                        if (result.error) {
                            res.status(500).send({
                                error: true,
                                message: 'The image is exceeding size limit. Maximum size is 2MB',
                                status: 500
                            });
                        }
                        else {
                            const update = { pic: req.body.picUrl };
                            //const filter = { userId: docs[0].userId };
                            const _id = new mongoose.Types.ObjectId(docs[0]._id);
                            yield user_schema_1.User.findByIdAndUpdate(_id, update).then(() => {
                                res.status(200).send({ error: false, message: 'Profile picture updated', code: 200 });
                            }).catch(err => {
                                throw {
                                    error: true, message: err.message, code: 500
                                };
                            });
                        }
                    }
                    else {
                        throw {
                            error: true, message: err.message, code: 500
                        };
                    }
                }));
            }
        }
        catch (err) {
            res.status(err.status).send(err);
        }
    }
});
exports.uploadProfilePicture = uploadProfilePicture;
//# sourceMappingURL=image.controller.js.map