import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import {UpdateShippingAddressInfoModel} from "../models/user/update-shipping-address-info-model";
import {SocialNetworkModel} from "../models/user/social-network-model";


const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        username: { type: String, unique: true, required: true },
        fullname: { type: String, default: null },
        email: { type: String, required: true, unique: true },
        active: { type: Boolean, default: false },
        basicInfoAvailableToChange: { type: Boolean, default: true },
        userMustInsertShippingAddress: { type: Boolean, default: true },
        password: { type: String, required: true },
        resetPasswordToken: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: number | null) => {
                return value === null || true;
            }, default: null },
        resetPasswordExpires: { type: Date, default: null },
        isCertified: { type: Boolean, default: false},

        pic: { type: String, default: null },
        role: { type: String, default: 'customer' },
        occupation: { type: String, default: null },
        companyName: { type: String, default: null },
        phone: { type: String, default: null },
        address: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: UpdateShippingAddressInfoModel | null) => {
                return value === null || true;
            }, default: null
        },
        socialNetwork: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: SocialNetworkModel | null) => {
                return value === null || true;
            }, default: null
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

        sellingItems: {type: [String], default: []},
        emailToken: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: number | null) => {
                return value === null || true;
            }, default: null },
        emailTokenExpires: { type: Date, default: null },

        accesstoken: {type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: string | null) => {
                return value === null || true;
            }, default: null },

        referralCode: { type: String, unique: true },
        referrer: { type: String, default: null },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

export const User = mongoose.model("user", userSchema);

export const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed: " + error);
    }
};


export const comparePasswords = async (inputPassword: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error: any) {
        throw new Error("Comparison failed: " + error);
    }
};
