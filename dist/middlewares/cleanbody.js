"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanBody = void 0;
const mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
const cleanBody = (req, res, next) => {
    try {
        req.body = (0, mongo_sanitize_1.default)(req.body);
        next();
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Could not sanitize body",
        });
    }
};
exports.cleanBody = cleanBody;
//# sourceMappingURL=cleanbody.js.map