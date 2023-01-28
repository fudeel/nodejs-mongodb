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
exports.Logout = void 0;
const user_schema_1 = require("../../schemas/user-schema");
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.decoded;
        const user = yield user_schema_1.User.findOne({ userId: id });
        if (user) {
            user.accesstoken = null;
            yield user.save();
            const customResponse = {
                error: false,
                success: true,
                message: 'User logged out',
                status: 200,
                forceLogout: false
            };
            return res.status(200).send(customResponse);
        }
        else {
            const customResponse = {
                error: true,
                message: 'Not authorized',
                status: 401,
                forceLogout: false
            };
            return res.status(401).send(customResponse);
        }
    }
    catch (error) {
        console.error("user-logout-error", error);
        const customResponse = {
            error: true,
            message: error.message,
            status: 500,
            forceLogout: false
        };
        return res.status(500).send(customResponse);
    }
});
exports.Logout = Logout;
//# sourceMappingURL=logout.js.map