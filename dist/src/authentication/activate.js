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
exports.Activate = void 0;
const user_schema_1 = require("../../schemas/user-schema");
const Activate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            const customResponse = {
                error: true,
                status: 400,
                message: "Please make a valid request",
            };
            return res.status(400).send(customResponse);
        }
        const user = yield user_schema_1.User.findOne({
            email: email,
            emailToken: code,
            emailTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            const customResponse = {
                error: true,
                message: "The code is not valid",
                status: 400
            };
            return res.status(400).send(customResponse);
        }
        else {
            if (user.active) {
                const customResponse = {
                    error: true,
                    message: "Account already activated",
                    status: 400,
                };
                return res.status(400).send(customResponse);
            }
            else {
                user.emailToken = null;
                user.emailTokenExpires = null;
                user.active = true;
                yield user.save();
                const customResponse = {
                    success: true,
                    message: "Account activated.",
                    status: 200,
                };
                return res.status(200).send(customResponse);
            }
        }
    }
    catch (error) {
        console.error("activation-error: ", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});
exports.Activate = Activate;
//# sourceMappingURL=activate.js.map