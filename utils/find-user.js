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
exports.findUser = void 0;
const user_schema_1 = require("../schemas/user-schema");
const activate_account_1 = require("./activate-account");
const findUser = (email, res, generateCode) => __awaiter(void 0, void 0, void 0, function* () {
    //1. Find if any account with that email exists in DB
    const user = yield user_schema_1.User.findOne({ email: email });
    // NOT FOUND - Throw error
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "Account not found",
        });
    }
    //2. Throw error if account is not activated
    if (!user.active) {
        if (generateCode) {
            const activateEmail = yield (0, activate_account_1.generateNewActivationCode)(user.email);
            user.emailToken = activateEmail.code;
            user.emailTokenExpires = activateEmail.expiry;
            yield user.save();
        }
        return res.status(401).json({
            error: true,
            message: `You must verify your email to activate your account.`,
            activationError: true,
            email: user.email
        });
    }
    return user;
});
exports.findUser = findUser;
