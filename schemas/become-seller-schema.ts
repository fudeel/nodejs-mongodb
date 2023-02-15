import mongoose from "mongoose";

const Schema = mongoose.Schema;


const becomeSellerSchema = new Schema(
    {
        requesterId: { type: String, unique: true, required: true }
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

export const BecomeSellerSchema = mongoose.model("become-seller", becomeSellerSchema);
