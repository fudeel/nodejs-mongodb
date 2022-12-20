import express from "express";
import {uploadProfilePicture} from "../src/user/image.controller";


const router = express.Router();

router.put( "/update-profile-picture", uploadProfilePicture);





export default router;
