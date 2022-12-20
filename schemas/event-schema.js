"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const eventSchema = new Schema({
    ownerId: { type: String, unique: true, required: true },
    eventName: { type: String, unique: false, required: true, maxLength: 20 },
    eventImage: { type: String, unique: false, required: true },
    description: { type: String, unique: false, required: true, maxLength: 90 },
    eventGenres: { type: [String], default: [] },
    location: Schema.Types.Mixed,
    address: Schema.Types.Mixed,
    availableSeats: { type: Number, default: 0 },
    date: { type: Date, required: true, default: null },
});
exports.Event = mongoose_1.default.model("event", eventSchema);
