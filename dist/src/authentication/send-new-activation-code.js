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
exports.sendNewActivationCode = void 0;
const joi_1 = __importDefault(require("joi"));
const find_user_1 = require("../../utils/find-user");
const sendNewActivationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activationEmailSchema = joi_1.default.object().keys({
        email: joi_1.default.string().email({ minDomainSegments: 2 }).required()
    });
    const result = yield activationEmailSchema.validate(req.body);
    if (result.error) {
        return res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }
    yield (0, find_user_1.findUser)(req.body.email, res, true);
});
exports.sendNewActivationCode = sendNewActivationCode;
//# sourceMappingURL=send-new-activation-code.js.map