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
exports.validateRecaptchaV3 = exports.validateRecaptchaV2 = void 0;
const joi_1 = __importDefault(require("joi"));
const recaptcha_verification_1 = require("../../utils/recaptcha-verification");
const recaptchaSchema = joi_1.default.object().keys({
    recaptchaKey: joi_1.default.string().required()
});
const validateRecaptchaV2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recaptcha = yield recaptchaSchema.validate(req.body);
        if (recaptcha.error) {
            return yield res.status(500).json({
                error: true,
                message: recaptcha.error.message.toString()
            });
        }
        const validator = yield (0, recaptcha_verification_1.recaptchaVerification)(req.body.recaptchaKey, 'v2');
        return res.status(400).json(validator);
    }
    catch (e) {
        console.log('V2 Error: ', e);
    }
});
exports.validateRecaptchaV2 = validateRecaptchaV2;
const validateRecaptchaV3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recaptcha = yield recaptchaSchema.validate(req.body);
        if (recaptcha.error) {
            return yield res.status(500).json({
                error: true,
                message: recaptcha.error.message.toString()
            });
        }
        const validator = yield (0, recaptcha_verification_1.recaptchaVerification)(req.body.recaptchaKey, 'v3');
        return res.status(200).json(validator);
    }
    catch (e) {
        console.log('Recaptcha verify try-catch error: ', e);
    }
});
exports.validateRecaptchaV3 = validateRecaptchaV3;
