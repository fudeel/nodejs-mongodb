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
exports.recaptchaVerification = void 0;
const axios_1 = __importDefault(require("axios"));
const recaptchaVerification = (recaptchaKey, version) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default
        .post(`https://www.google.com/recaptcha/api/siteverify?secret=${version === 'v2' ?
        process.env.GOOGLE_RECAPTCHA_V2_SECRET_KEY : process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY}&response=${recaptchaKey}`, {}, {})
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return yield res.data;
    })).catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        return yield err;
    }));
});
exports.recaptchaVerification = recaptchaVerification;
//# sourceMappingURL=recaptcha-verification.js.map