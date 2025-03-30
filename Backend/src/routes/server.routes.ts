import { Router } from "express";
import {
    createServer,
    getServersWhereUserIsMember,
    joinServer,
    leaveServer,
    deleteServer
} from '../controllers/server.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/getServersWhereUserIsMember").post(verifyJWT, getServersWhereUserIsMember)

router.route("/createServer").post(
    verifyJWT,
    upload.fields([
        {
            name: "serverImage",
            maxCount: 1
        }
    ]),
    createServer
)

router.route("/joinServer").post(verifyJWT, joinServer)

router.route("/leaveServer").post(verifyJWT, leaveServer)

router.route("/deleteServer").post(verifyJWT, deleteServer)

export default router