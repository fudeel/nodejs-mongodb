const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerAvailabilitySchema = new Schema(
    {
        userId: { type: String, unique: true, required: true },
        phone_number: { type: String, required: true, unique: true },
        max_lat: {type: String, required: true, unique: true},
        max_lng: {type: String, required: true, unique: true},
        user_rank: {type: String, required: true, unique: false},
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

const playerAvailability = mongoose.model("playerAvailability", playerAvailabilitySchema);
module.exports = playerAvailability;
