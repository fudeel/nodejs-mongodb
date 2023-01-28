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
exports.generateNewActivationCode = void 0;
const mailer_1 = require("./mailer");
const generateNewActivationCode = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const code = Math.floor(100000 + Math.random() * 900000);
    const threeHours = 3 * 60 * 60 * 1000;
    const futureTime = new Date(Date.now() + threeHours);
    const sendVerificationLink = yield (0, mailer_1.sendEmail)(email, code, "activate");
    if (sendVerificationLink.error) {
        const error = {
            error: true,
            message: "Couldn't send verification email.",
            code: null,
            expiry: null
        };
        return error;
    }
    else {
        return {
            error: false,
            message: `Email sent successfully to ${email}`,
            code: code,
            expiry: new Date(futureTime)
        };
    }
});
exports.generateNewActivationCode = generateNewActivationCode;
//# sourceMappingURL=activate-account.js.map