import { Router } from "express";
import {
    getProfilesByServerId,
    getUserProfile,
    getProfileById,
} from '../controllers/profile.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/getUserProfile").get(verifyJWT, getUserProfile)

router.route("/getProfilesByServerId").post(verifyJWT, getProfilesByServerId)

router.route("/getProfileById").post(verifyJWT, getProfileById)


export default router