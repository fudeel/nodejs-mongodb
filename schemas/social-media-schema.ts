import {Schema} from "mongoose";

export const socialMediaSchema = new Schema({
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