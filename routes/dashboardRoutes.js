import express from "express";
import {validateToken} from "../middlewares/validateToken.js";
import {GetUsersByFilter} from "../src/dashboard/dashboard.controller.js";
import {cleanBody} from "../middlewares/cleanbody.js";

const router = express.Router();

router.post("/get-all-creators", validateToken, cleanBody, GetUsersByFilter);





export default router;
