import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {number} from "joi";

const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        username: { type: String, unique: true, required: true },
        fullname: { type: String, default: null },
        email: { type: String, required: true, unique: true },
        active: { type: Boolean, default: false },
        password: { type: String, required: true },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },

        pic: { type: String, default: null },
        roles: { type: Number, default: [] },
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


        emailToken: { type: String, default: null },
        emailTokenExpires: { type: Date, default: null },

        accessToken: { type: String, default: null },

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

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed", error);
    }
};


export const comparePasswords = async (inputPassword, hashedPassword) => {
    console.log('input password: ', inputPassword);
    console.log('hashed password: ', hashedPassword);
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error("Comparison failed", error);
    }
};
