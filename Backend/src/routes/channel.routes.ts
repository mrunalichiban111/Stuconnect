import { Router } from "express";
import { getChannelsByServerId, createChannel, deleteChannel } from '../controllers/channel.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/getChannelsByServerId").post(verifyJWT, getChannelsByServerId)

router.route("/createChannel").post(verifyJWT, createChannel)

router.route("/deleteChannel").post(verifyJWT, deleteChannel)

export default router