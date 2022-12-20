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
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const options = {
    expiresIn: "1h",
};
function generateJwt(email, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        try {
            const payload = { email: email, id: userId };
            if (process.env.JWT_SECRET) {
                token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
                return { error: false, token: token };
            }
            else {
                return { error: true, message: 'Not valid JWT secret key' };
            }
        }
        catch (error) {
            return { error: true };
        }
    });
}
exports.generateJwt = generateJwt;
