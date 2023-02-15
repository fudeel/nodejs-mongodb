"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BecomeSellerSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const becomeSellerSchema = new Schema({
    requesterId: { type: String, unique: true, required: true }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});
exports.BecomeSellerSchema = mongoose_1.default.model("become-seller", becomeSellerSchema);
//# sourceMappingURL=become-seller-schema.js.map