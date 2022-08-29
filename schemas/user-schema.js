import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        email: { type: String, required: true, unique: true },
        active: { type: Boolean, default: false },
        password: { type: String, required: true },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },

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
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error("Comparison failed", error);
    }
};
