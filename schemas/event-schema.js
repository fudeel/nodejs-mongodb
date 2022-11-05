import mongoose from "mongoose";

const Schema = mongoose.Schema;


const eventSchema = new Schema(
    {
            ownerId: { type: String, unique: true, required: true },
            eventName: { type: String, unique: false, required: true, maxLength: 20 },
            eventImage: { type: String, unique: false, required: true },
            description: { type: String, unique: false, required: true, maxLength: 90 },
            eventGenres: { type: [String], default: [] },
            location: Schema.Types.Mixed,
            address: Schema.Types.Mixed,
            availableSeats: { type: Number, default: 0 },
            date: { type: Date, required: true, default: null },
    }
);

export const Event = mongoose.model("event", eventSchema);
