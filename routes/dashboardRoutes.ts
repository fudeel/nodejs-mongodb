import express from "express";
import {validateTokenWithRecaptchaV3} from "../middlewares/validateToken";
import {getEvents, GetUsersByFilter} from "../src/dashboard/dashboard.controller";
import {cleanBody} from "../middlewares/cleanbody";

const router = express.Router();

router.post("/get-all-events", validateTokenWithRecaptchaV3, cleanBody, getEvents);
router.post("/get-users-by-filter", validateTokenWithRecaptchaV3, cleanBody, GetUsersByFilter);





export default router;
