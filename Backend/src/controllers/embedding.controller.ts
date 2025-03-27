import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as fs from 'fs';
import * as path from 'path';
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from 'uuid';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import 'dotenv/config';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
import GPTfile from "../models/gptFile.model.js";
import { IUser } from "../models/user.model.js";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    model: 'dunzhang/stella_en_1.5B_v5',
});

interface EmbeddedDataType {
    id: string;
    values: any;
    metadata: any;
}

let embeddedData: EmbeddedDataType[] = [];

async function getEmbeddings(texts: string[]) {
    try {
        console.log("Embedding Started");
        const embedding = await embeddings._embed(texts);
        console.log('Embedding:', embedding[0].length);
        return embedding[0];
    } catch (error) {
        console.error('Error fetching embeddings:', error);
        throw error;
    }
}

async function createChunksAndEmbed(data: string): Promise<EmbeddedDataType[]> {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 80,
    });

    // Ensure you await the splitText method if it returns a Promise
    const chunks = await splitter.splitText(data);

    const embeddedChunks = await Promise.all(
        chunks.map(async (chunk) => {
            const values = await getEmbeddings([chunk]);
            const metadata = { chunk, timestamp: new Date().toISOString() };

            return {
                id: uuidv4(),
                values,
                metadata,
            };
        })
    );
    // Add the embedded chunks to the global embeddedData array
    embeddedData = embeddedChunks;
    console.log("Chunks created and embedded data prepared.");
    console.log(embeddedData);
    return embeddedData;
}


const pushDataToPinecone = async (pineconeInput: EmbeddedDataType[], fileName: string) => {
    try {
        await pineconeIndex.namespace(fileName).upsert(pineconeInput);
        // const stats = await pineconeIndex.describeIndexStats();
        // console.log(stats);
        return fileName;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getFileCreateEmbeddingStoreInPinecone = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { filePath, fileName } = req.body;
    const currentUser : IUser = req.user;

    if (!currentUser) {
        throw new ApiError(400, "Cannot Get Current User");
    }
    if (!filePath) {
        throw new ApiError(400, "Cannot Get File Path");
    }

    try {
        const file = path.resolve(filePath);
        const data = await fs.promises.readFile(file, 'utf8');

        if (data) {
            const pineconeInput = await createChunksAndEmbed(data);
            const file = await pushDataToPinecone(pineconeInput, fileName);

            // Save the file data in MongoDB
            const savedFile = await GPTfile.create({
                fileName: fileName,
                pineconeNamespace: file,
                userId: currentUser._id,
            });

            return res.status(200).json(new ApiResponse(200, { savedFile }, "File processed and data stored in Pinecone successfully"));
        } else {
            throw new ApiError(404, "File content is empty.");
        }
    } catch (error) {
        console.error('Error processing file:', error);
        throw new ApiError(500, "Error processing file.");
    }
});

const fetchSimilarChunkFromPinecone = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { query, fileName } = req.body;

    if (!query) {
        throw new ApiError(400, "Query is required.");
    }
    if (!fileName) {
        throw new ApiError(400, "File name is required.");
    }

    try {
        // Check if the user is the owner of the file
        const file = await GPTfile.findOne({ fileName, userId: req.user?._id });
        if (!file) {
            throw new ApiError(403, "You do not have permission to access this file.");
        }

        const queryEmbeddings = await getEmbeddings([query]);
        const queryResponse = await pineconeIndex.namespace(fileName).query({
            topK: 5,
            vector: queryEmbeddings,
            includeMetadata: true
        });

        return res.status(200).json(new ApiResponse(200, { queryResponse }, "Query to Pinecone successful"));
    } catch (error) {
        console.error('Error querying Pinecone:', error);
        throw new ApiError(500, "Error querying Pinecone.");
    }
});

const deleteNamespaceFromPinecone = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { fileName } = req.body;

    if (!fileName) {
        throw new ApiError(400, "File name is required.");
    }

    try {
        // Check if the user is the owner of the file
        const file = await GPTfile.findOne({ fileName, userId: req.user?._id });
        if (!file) {
            throw new ApiError(403, "You do not have permission to delete this file.");
        }

        await pineconeIndex.namespace(fileName).deleteAll();
        console.log(`Namespace ${fileName} deleted successfully from Pinecone.`);

        // Optionally, you might want to delete the corresponding record from MongoDB as well
        await GPTfile.deleteOne({ _id: file._id });

        return res.status(200).json(new ApiResponse(200, null, `Namespace ${fileName} deleted successfully from Pinecone.`));
    } catch (error) {
        console.error('Error deleting namespace from Pinecone:', error);
        throw new ApiError(500, "Error deleting namespace from Pinecone.");
    }
});


const fetchAllFilesFromDB = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Fetch all file names associated with the user
        const files = await GPTfile.find({ userId: req.user?._id }).select('fileName').exec();

        // If no files are found, return an empty array with a user-friendly message
        if (!files || files.length === 0) {
            return res.status(200).json(new ApiResponse(200, { fileNames: [] }, "No files found for this user."));
        }

        // Prepare a response with just the file names
        const fileNames = files.map(file => file.fileName);

        return res.status(200).json(new ApiResponse(200, { fileNames }, "File names fetched successfully from the database."));
    } catch (error) {
        console.error('Error fetching file names from the database:', error);
        return res.status(500).json(new ApiResponse(500, null, "Error fetching file names from the database."));
    }
});




export {
    getFileCreateEmbeddingStoreInPinecone,
    fetchSimilarChunkFromPinecone,
    deleteNamespaceFromPinecone,
    fetchAllFilesFromDB,
};
