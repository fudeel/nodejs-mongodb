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
exports.ReferredAccounts = void 0;
const user_schema_1 = require("../../schemas/user-schema");
const ReferredAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { referralCode } = req.decoded;
        const referredAccounts = yield user_schema_1.User.find({ referrer: referralCode }, { email: 1, referralCode: 1, _id: 0 });
        return res.send({
            success: true,
            accounts: referredAccounts,
            total: referredAccounts.length,
        });
    }
    catch (error) {
        console.error("fetch-referred-error: ", error);
    }
});
exports.ReferredAccounts = ReferredAccounts;
//# sourceMappingURL=referral.js.map