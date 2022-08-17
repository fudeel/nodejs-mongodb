const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerAvailabilitySchema = new Schema(
    {
        userId: { type: String, required: true, unique: false },
        phone_number: { type: String, required: true, unique: false },
        lat: {type: Number, required: true, unique: false},
        lng: {type: Number, required: true, unique: false},
        user_rank: {type: String, required: true, unique: false},
        max_distance: {type: Number, required: true, unique: false},
        selected_date: {type: Date, required: true, unique: false}
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
