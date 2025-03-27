import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { fetchConversation } from "../controllers/conversation.js";

const router = Router()

router.route("/fetchConversation").post(verifyJWT, fetchConversation)

export default router