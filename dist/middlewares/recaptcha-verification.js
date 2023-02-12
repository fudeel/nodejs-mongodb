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
const recaptchaVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('>  waiting for recaptcha verification \n');
    try {
        yield axios_1.default
            .post(`https://www.google.com/recaptcha/api/siteverify?secret=${req.body.version === 'v2' ?
            process.env.GOOGLE_RECAPTCHA_V2_SECRET_KEY : process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY}&response=${req.body.recaptchaKey}`, {}, {})
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            if (res.data.success) {
                console.log('> recaptcha verification ok');
                console.table(res.data);
                next();
            }
            else {
                throw {
                    error: true,
                    message: 'Error in accepting the ReCaptcha code. Are you a bot?',
                    status: 401,
                    forceLogout: true
                };
            }
        })).catch(() => {
            throw {
                error: true,
                message: 'Error in accepting the ReCaptcha code. Are you a bot?',
                status: 401,
                forceLogout: true
            };
        });
    }
    catch (err) {
        res.status(err.status).send(err);
    }
});
exports.recaptchaVerification = recaptchaVerification;
//# sourceMappingURL=recaptcha-verification.js.map