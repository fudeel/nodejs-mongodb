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
const social_media_schema_1 = require("./social-media-schema");
const Schema = mongoose_1.default.Schema;
const SocialMedia = mongoose_1.default.model("SocialMedia", social_media_schema_1.socialMediaSchema);
const userSchema = new Schema({
    userId: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    fullname: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },
    userMustInsertShippingAddress: { type: Boolean, default: true },
    password: { type: String, required: true },
    resetPasswordToken: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    resetPasswordExpires: { type: Date, default: null },
    isCertified: { type: Boolean, default: false },
    pic: { type: String, default: null },
    role: { type: String, default: 'customer' },
    occupation: { type: String, default: null },
    companyName: { type: String, default: null },
    phone: { type: String, default: null },
    address: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    socialNetwork: {
        instagram: {
            profile: { type: String, default: null },
            status: {
                type: String,
                enum: ["PENDING", "VERIFIED", "DENIED", null],
                default: null
            }
        },
        tiktok: {
            profile: { type: String, default: null },
            status: {
                type: String,
                enum: ["PENDING", "VERIFIED", "DENIED", null],
                default: null
            }
        },
        twitch: {
            profile: { type: String, default: null },
            status: {
                type: String,
                enum: ["PENDING", "VERIFIED", "DENIED", null],
                default: null
            }
        },
        twitter: {
            profile: { type: String, default: null },
            status: {
                type: String,
                enum: ["PENDING", "VERIFIED", "DENIED", null],
                default: null
            }
        }
    },
    becomeSellerRequest: { type: String, default: null },
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    website: { type: String, default: null },
    language: { type: String, default: null },
    timeZone: { type: String, default: null },
    rating: { type: Number, default: 50 },
    communication: Schema.Types.Mixed,
    emailSettings: Schema.Types.Mixed,
    sellingItems: { type: [String], default: [] },
    emailToken: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
        validate: (value) => {
            return value === null || true;
        }, default: null
    },
    emailTokenExpires: { type: Date, default: null },
    accesstoken: { type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
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