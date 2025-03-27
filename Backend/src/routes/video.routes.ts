import { Router } from "express";
import { 
    createLivekitVideoToken
} from '../controllers/video.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/createLivekitVideoToken").post(verifyJWT, createLivekitVideoToken)

export default router