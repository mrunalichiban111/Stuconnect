import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Conversation, { IConversation } from "../models/conversation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Member from "../models/member.model.js";


const fetchConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentUserMemberId, targetUserMemberId } = req.body;

    if (!currentUserMemberId || !targetUserMemberId) {
        throw new ApiError(400, "Member IDs are required");
    }

    let memberIdOne = currentUserMemberId;
    let memberIdTwo = targetUserMemberId;
    if (memberIdOne > memberIdTwo) {
        // Swap the member IDs to ensure consistent ordering
        const temp = memberIdOne;
        memberIdOne = memberIdTwo;
        memberIdTwo = temp;
    }

    const existingConversation: IConversation | null = await Conversation.findOne({
        memberIdOne: memberIdOne,
        memberIdTwo: memberIdTwo
    });

    if (existingConversation) {
        return res.status(200).json(new ApiResponse(200, existingConversation, "Conversation fetched successfully"));
    }

    const conversation: IConversation = new Conversation({
        memberIdOne: memberIdOne,
        memberIdTwo: memberIdTwo
    });

    await conversation.save();

    try {
        await Member.findByIdAndUpdate(
            currentUserMemberId,
            {
                $push: { conversationInitiated: conversation._id }
            },
            { new: true }
        );

        await Member.findByIdAndUpdate(
            targetUserMemberId,
            {
                $push: { conversationReceived: conversation._id }
            },
            { new: true }
        );
    } catch (error) {
        throw new ApiError(400, "Error in updating member");
    }

    return res.status(201).json(new ApiResponse(201, conversation, "Conversation created successfully"));
});

export {
    fetchConversation,
};