"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCreatorsByFilter = exports.getEvents = exports.GetUsersByFilter = void 0;
const joi_1 = __importDefault(require("joi"));
const event_schema_1 = require("../../schemas/event-schema");
const user_schema_1 = require("../../schemas/user-schema");
const filterSchema = joi_1.default.object().keys({
    maxDistance: joi_1.default.number(),
    latitude: joi_1.default.number().optional(),
    longitude: joi_1.default.number().optional()
});
const userFilterSchema = joi_1.default.object().keys({
    role: joi_1.default.array().items(joi_1.default.string()),
    username: joi_1.default.string().optional()
});
const GetUsersByFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // POST validation
        const result = yield userFilterSchema.validate(req.body);
        if (result.error) {
            return yield res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }
        const filterBody = {
            role: null,
            username: null
        };
        if (req.body.role)
            filterBody.role = req.body.role;
        if (req.body.username)
            filterBody.username = req.body.username;
        user_schema_1.User.find(filterBody).select('username pic role sellingItems isCertified').exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            }
            else {
                res.status(500).send({ error: true, message: err.message, code: 500 });
            }
        });
    }
    catch (err) {
        console.error("Login error try-catch", err);
    }
});
exports.GetUsersByFilter = GetUsersByFilter;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // POST validation
        const result = yield filterSchema.validate(req.body);
        if (result.error) {
            return yield res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }
        event_schema_1.Event.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.longitude)] },
                    key: 'location',
                    maxDistance: parseFloat('1000') * 1609,
                    distanceField: 'dist.calculated',
                    spherical: true
                }
            }
        ]).exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            }
            else {
                res.status(500).send({ error: true, message: err.message, code: 500 });
            }
        });
    }
    catch (err) {
        console.error("Events error try-catch", err);
    }
});
exports.getEvents = getEvents;
const getAllCreatorsByFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // POST validation
        const result = yield filterSchema.validate(req.body);
        if (result.error) {
            return yield res.status(500).json({
                error: true,
                message: result.error.message.toString()
            });
        }
        event_schema_1.Event.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.longitude)] },
                    key: 'location',
                    maxDistance: parseFloat('1000') * 1609,
                    distanceField: 'dist.calculated',
                    spherical: true
                }
            }
        ]).exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            }
            else {
                res.status(500).send({ error: true, message: err.message, code: 500 });
            }
        });
    }
    catch (err) {
        console.error("Login error try-catch", err);
    }
});
exports.getAllCreatorsByFilter = getAllCreatorsByFilter;
//# sourceMappingURL=dashboard.controller.js.map