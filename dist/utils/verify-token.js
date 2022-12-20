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
exports.verifyIdToken = void 0;
const config_1 = __importDefault(require("./config"));
const verifyIdToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const idToken = req.headers['idtoken'];
    return yield config_1.default.auth().verifyIdToken(idToken)
        .then((decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
        yield console.log({ 'Decoded token': decodedToken });
        res.status(200).send(true);
        next();
    }))
        .catch(() => {
        res.status(200).send(false);
        next();
    });
});
exports.verifyIdToken = verifyIdToken;
//# sourceMappingURL=verify-token.js.map