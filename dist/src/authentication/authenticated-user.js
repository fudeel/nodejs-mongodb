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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserInfo = void 0;
const user_schema_1 = require("../../schemas/user-schema");
const getCurrentUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('> getting user info');
    try {
        if (req.headers['accesstoken'] !== null && req.headers['accesstoken'] !== '') {
            try {
                const accesstoken = req.headers['accesstoken'].split(" ")[1];
                yield user_schema_1.User.find({ accesstoken }).select('username firstname lastname phone email pic role sellingItems isCertified basicInfoAvailableToChange userMustInsertShippingAddress address socialNetwork becomeSellerRequest').exec((err, docs) => {
                    if (!err) {
                        if (docs.length === 0) {
                            res.status(401).send({
                                error: true,
                                message: 'Session expired or there is another error with your account',
                                status: 401,
                                forceLogout: true
                            });
                        }
                        else {
                            res.status(200).send(docs[0]);
                        }
                    }
                    else if (err) {
                        throw {
                            error: true,
                            message: "Account already activated",
                            status: 500,
                        };
                    }
                });
            }
            catch (error) {
                res.status(error.status).send(error);
            }
        }
        else {
            console.log('X token is not in header');
            res.status(500).send({
                error: true,
                message: 'accesstoken code invalid or missing',
                code: 500
            });
        }
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});
exports.getCurrentUserInfo = getCurrentUserInfo;
//# sourceMappingURL=authenticated-user.js.map