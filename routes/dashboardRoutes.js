import express from "express";
import {validateTokenWithRecaptchaV3} from "../middlewares/validateToken.js";
import {getEvents} from "../src/dashboard/dashboard.controller.js";
import {cleanBody} from "../middlewares/cleanbody.js";

const router = express.Router();

router.post("/get-all-events", validateTokenWithRecaptchaV3, cleanBody, getEvents);





export default router;
