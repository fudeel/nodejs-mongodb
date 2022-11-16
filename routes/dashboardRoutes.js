import express from "express";
import {validateTokenWithRecaptchaV3} from "../middlewares/validateToken.js";
import {getEvents, GetUsersByFilter} from "../src/dashboard/dashboard.controller.js";
import {cleanBody} from "../middlewares/cleanbody.js";

const router = express.Router();

router.post("/get-all-events", validateTokenWithRecaptchaV3, cleanBody, getEvents);
router.post("/get-users-by-filter", validateTokenWithRecaptchaV3, cleanBody, GetUsersByFilter);





export default router;
