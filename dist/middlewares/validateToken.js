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
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../schemas/user-schema");
function validateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('> Validating Token');
        console.log('> Incoming accesstoken: ', req.headers.accesstoken);
        const accesstoken = req.headers.accesstoken;
        let result;
        if (!accesstoken) {
            console.log('X missing access token');
            const customResponse = {
                error: true,
                message: "Access token is missing",
                status: 401,
                forceLogout: true
            };
            return res.status(401).send(customResponse);
        }
        let token;
        console.log('> splitting access token');
        if (req.headers.accesstoken) {
            token = req.headers.accesstoken.split(" ")[1];
        } // Bearer <token>
        else {
            console.log('X non-splittable token');
            const customResponse = {
                error: true,
                message: `accesstoken error`,
                status: 403,
                forceLogout: true
            };
            return res.status(403).send(customResponse);
        }
        const options = {
            expiresIn: "1h",
        };
        console.log('> finding token validity');
        try {
            const user = yield user_schema_1.User.findOne({
                accesstoken: token,
            }).then((u) => {
                return u;
            });
            if (!user) {
                console.log('X no token validity');
                const customResponse = {
                    error: true,
                    message: `accesstoken error`,
                    status: 403,
                    forceLogout: true
                };
                return res.status(403).send(customResponse);
            }
            console.log(`> this token is valid for user with email: ${user.email}`);
            result = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, options);
            if (!user.userId === result.id) {
                const customResponse = {
                    error: true,
                    message: `Invalid token`,
                    status: 401,
                    forceLogout: true
                };
                return res.status(401).send(customResponse);
            }
            result["referralCode"] = user.referralCode;
            req.decoded = result;
            req.user = user;
            next();
        }
        catch (err) {
            // console.log(err);
            if (err.name === "TokenExpiredError") {
                const customResponse = {
                    error: true,
                    message: 'Token expired',
                    status: 401,
                    forceLogout: true
                };
                return res.status(401).send(customResponse);
            }
            else {
                const customResponse = {
                    error: true,
                    message: `Authentication error`,
                    status: 403,
                    forceLogout: true
                };
                return res.status(403).send(customResponse);
            }
        }
    });
}
exports.validateToken = validateToken;
//# sourceMappingURL=validateToken.js.map