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
exports.uploadProfilePicture = void 0;
const joi_1 = __importDefault(require("joi"));
const user_schema_1 = require("../../schemas/user-schema");
const uploadProfilePictureSchema = joi_1.default.object().keys({
    picUrl: joi_1.default.string().required(),
    _id: joi_1.default.string().required()
});
const uploadProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['authorization'] !== null && req.headers['authorization'] !== '') {
        try {
            if (req.headers['authorization']) {
                const accessToken = req.headers['authorization'].slice(7);
                yield user_schema_1.User.find({ accessToken }).exec((err, docs) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!err) {
                        // POST validation
                        const result = yield uploadProfilePictureSchema.validate({ picUrl: req.body.picUrl, _id: docs[0].userId });
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
                        yield user_schema_1.User.updateOne(result, updatePic);
                        res.status(200).send({ error: false, message: 'Profile picture updated', code: 200 });
                    }
                    else {
                        res.status(500).send({ error: true, message: err.message, code: 500 });
                    }
                }));
            }
        }
        catch (err) {
            console.log('Error in uploading user picture: ', err);
        }
    }
});
exports.uploadProfilePicture = uploadProfilePicture;
