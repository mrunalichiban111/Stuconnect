import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    getFileCreateEmbeddingStoreInPinecone,
    fetchSimilarChunkFromPinecone,
    deleteNamespaceFromPinecone,
    fetchAllFilesFromDB
} from '../controllers/embedding.controller.js'

const router = Router()

router.route("/getFileCreateEmbeddingStoreInPinecone").post(verifyJWT, getFileCreateEmbeddingStoreInPinecone)
router.route("/fetchSimilarChunkFromPinecone").post(verifyJWT, fetchSimilarChunkFromPinecone)
router.route("/deleteNamespaceFromPinecone").post(verifyJWT, deleteNamespaceFromPinecone)
router.route("/fetchAllFilesFromDB").get(verifyJWT, fetchAllFilesFromDB)

export default router