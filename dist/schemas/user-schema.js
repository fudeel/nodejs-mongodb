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
exports.comparePasswords = exports.hashPassword = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    userId: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    fullname: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },
    password: { type: String, required: true },
    resetPasswordToken: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    resetPasswordExpires: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    isCertified: { type: Boolean, default: false },
    pic: { type: String, default: null },
    role: { type: String, default: 'customer' },
    occupation: { type: String, default: null },
    companyName: { type: String, default: null },
    phone: { type: String, default: null },
    address: Schema.Types.Mixed,
    socialNetworks: Schema.Types.Mixed,
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    website: { type: String, default: null },
    language: { type: String, default: null },
    timeZone: { type: String, default: null },
    communication: Schema.Types.Mixed,
    emailSettings: Schema.Types.Mixed,
    sellingItems: { type: [String], default: [] },
    emailToken: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    emailTokenExpires: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    accessToken: { type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        validate: (value) => {
            return value === null || true;
        }, default: null },
    referralCode: { type: String, unique: true },
    referrer: { type: String, default: null },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});
exports.User = mongoose_1.default.model("user", userSchema);
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    }
    catch (error) {
        throw new Error("Hashing failed: " + error);
    }
});
exports.hashPassword = hashPassword;
const comparePasswords = (inputPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compare(inputPassword, hashedPassword);
    }
    catch (error) {
        throw new Error("Comparison failed: " + error);
    }
});
exports.comparePasswords = comparePasswords;
//# sourceMappingURL=user-schema.js.map