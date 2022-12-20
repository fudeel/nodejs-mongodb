"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("../src/user/image.controller");
const router = express_1.default.Router();
router.put("/update-profile-picture", image_controller_1.uploadProfilePicture);
exports.default = router;
//# sourceMappingURL=imagesRoutes.js.map