"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.checkUserActivation = void 0;
const joi_1 = __importStar(require("joi"));
const decode_token_1 = require("../../utils/decode-token");
const find_user_1 = require("../../utils/find-user");
const checkUserActivation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['idtoken'] && req.headers['idtoken'] === typeof joi_1.string) {
        const decodedEmail = yield (0, decode_token_1.decodeToken)(req.headers['idtoken']);
        if (!decodedEmail) {
            return res.status(400).json({
                error: true,
                message: "Email empty or not valid format",
            });
        }
        const user = yield (0, find_user_1.findUser)(decodedEmail, res, false);
        res.status(200).send({
            status: 200,
            error: false,
            user: user
        });
    }
    const activationSchema = joi_1.default.object().keys({
        email: joi_1.default.string().email({ minDomainSegments: 2 })
    });
    const result = yield activationSchema.validate(req.body);
    if (result.error) {
        return res.status(500).json({
            error: true,
            message: result.error.message.toString()
        });
    }
});
exports.checkUserActivation = checkUserActivation;
