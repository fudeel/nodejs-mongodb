import express from "express";
import {getEvents, GetUsersByFilter} from "../src/dashboard/dashboard.controller";
import {cleanBody} from "../middlewares/cleanbody";

const router = express.Router();

router.post("/get-all-events", cleanBody, getEvents);
router.post("/get-users-by-filter", cleanBody, GetUsersByFilter);





export default router;
