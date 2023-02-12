"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialMediaSchema = void 0;
const mongoose_1 = require("mongoose");
exports.socialMediaSchema = new mongoose_1.Schema({
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
});
//# sourceMappingURL=social-media-schema.js.map