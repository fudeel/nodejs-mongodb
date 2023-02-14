import mongoose from "mongoose";
import {UpdateShippingAddressInfoModel} from "../models/user/update-shipping-address-info-model";
import {UpdateBasicInfoModel} from "../models/user/update-basic-info-model";

const Schema = mongoose.Schema;


const becomeSellerSchema = new Schema(
    {
        requesterId: { type: String, unique: true, required: true },
        addressInfo: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: UpdateShippingAddressInfoModel | null) => {
                return value === null || true;
            }, default: null
        },
        basicInfo: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            validate: (value: UpdateBasicInfoModel | null) => {
                return value === null || true;
            }, default: null
        },
        validSocialNetworks: [
            {
                profile: String,
                social: String,
                status: {
                    type: String,
                    enum: ["PENDING", "VERIFIED", "DENIED", null],
                    default: null
                }
            }
        ],
        email: { type: String, unique: true, required: true },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

export const BecomeSellerSchema = mongoose.model("become-seller", becomeSellerSchema);
