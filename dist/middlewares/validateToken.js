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
exports.validateToken = exports.validateTokenWithRecaptchaV3 = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../schemas/user-schema");
const recaptcha_verification_1 = require("../utils/recaptcha-verification");
function validateTokenWithRecaptchaV3(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, recaptcha_verification_1.recaptchaVerification)(req.headers['recaptchakey'], 'v3').then((r) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            /* Check if the user is sending to the server a proper recaptchaKey before continuing */
            if (r.success) {
                next();
            }
            else {
                /* If the recaptchaKey is not valid the user will be forced to leave the application */
                return (_a = res === null || res === void 0 ? void 0 : res.status(403)) === null || _a === void 0 ? void 0 : _a.json({
                    error: true,
                    message: "Not authorized to proceed. Please Login again",
                    forceLogout: true
                });
            }
        })).catch((err) => {
            var _a;
            console.log('Error in recaptcha validation v3: ', err);
            return (_a = res === null || res === void 0 ? void 0 : res.status(403)) === null || _a === void 0 ? void 0 : _a.json({
                error: true,
                message: "Not authorized to proceed.",
                forceLogout: true
            });
        });
    });
}
exports.validateTokenWithRecaptchaV3 = validateTokenWithRecaptchaV3;
function validateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationHeader = req.headers.authorization;
        let result;
        if (!authorizationHeader)
            return res.status(401).json({
                error: true,
                message: "Access token is missing",
            });
        let token;
        if (req.headers.authorization)
            token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        else {
            result = {
                error: true,
                message: `Authorization error`,
            };
            return res.status(403).json(result);
        }
        const options = {
            expiresIn: "1h",
        };
        try {
            const user = yield user_schema_1.User.findOne({
                accessToken: token,
            });
            if (!user) {
                result = {
                    error: true,
                    message: `Authorization error`,
                };
                return res.status(403).json(result);
            }
            result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, options);
            if (!user.userId === result.id) {
                result = {
                    error: true,
                    message: `Invalid token`,
                };
                return res.status(401).json(result);
            }
            result["referralCode"] = user.referralCode;
            // req.decoded = result;
            next();
        }
        catch (err) {
            // console.log(err);
            if (err.name === "TokenExpiredError") {
                result = {
                    error: true,
                    message: `TokenExpired`,
                };
            }
            else {
                result = {
                    error: true,
                    message: `Authentication error`,
                };
            }
            return res.status(403).json(result);
        }
    });
}
exports.validateToken = validateToken;
//# sourceMappingURL=validateToken.js.map