import express from "express";
import {validateTokenWithRecaptchaV3} from "../middlewares/validateToken.js";
import {GetUsersByFilter} from "../src/dashboard/dashboard.controller.js";
import {cleanBody} from "../middlewares/cleanbody.js";

const router = express.Router();

router.post("/get-all-creators", validateTokenWithRecaptchaV3, cleanBody, GetUsersByFilter);





export default router;
