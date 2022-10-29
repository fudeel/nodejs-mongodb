import express from "express";
import {uploadProfilePhoto} from "../src/user/image.controller.js";



import multer from "multer";


const upload = multer({ dest: 'uploads/' })


const router = express.Router();

router.post( "/upload-profile-photo", upload.single('avatar'), uploadProfilePhoto);





export default router;
