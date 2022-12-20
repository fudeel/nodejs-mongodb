"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateToken_1 = require("../middlewares/validateToken");
const dashboard_controller_1 = require("../src/dashboard/dashboard.controller");
const cleanbody_1 = require("../middlewares/cleanbody");
const router = express_1.default.Router();
router.post("/get-all-events", validateToken_1.validateTokenWithRecaptchaV3, cleanbody_1.cleanBody, dashboard_controller_1.getEvents);
router.post("/get-users-by-filter", validateToken_1.validateTokenWithRecaptchaV3, cleanbody_1.cleanBody, dashboard_controller_1.GetUsersByFilter);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map