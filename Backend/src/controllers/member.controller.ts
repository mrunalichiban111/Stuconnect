import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Member, { IMember } from "../models/member.model.js";
import Profile, { IProfile } from "../models/profile.model.js";


const getMembersByServerId = asyncHandler(async(req: AuthRequest, res: Response) => {
    const { serverId } = req.body;
    if(!serverId){
        throw new ApiError(400, "Cannot get server Id");
    }

    const members: IMember[] | null = await Member.find({ serverId })
    if (!members.length) {
        return res.status(200).json(new ApiResponse(200, [], "No channels found for this server"));
    }  

    return res.status(200).json(new ApiResponse(200, members, "Members fetched successfully"));
})

const changeRoleToGuest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { memberId } = req.body;
    if (!memberId) {
        throw new ApiError(400, "Cannot get member Id");
    }

    const member: IMember | null = await Member.findOneAndUpdate(
        { _id: memberId },
        { $set: { role: 'GUEST' } },
        { new: true }
    );

    if (!member) {
        throw new ApiError(400, "This member does not exist");
    }

    return res.status(200).json(new ApiResponse(200, member, "Role changed to guest successfully"));
});

const changeRoleToModerator = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { memberId } = req.body;
    if (!memberId) {
        throw new ApiError(400, "Cannot get member Id");
    }

    const member: IMember | null = await Member.findOneAndUpdate(
        { _id: memberId },
        { $set: { role: 'MODERATOR' } },
        { new: true }
    );

    if (!member) {
        throw new ApiError(400, "This member does not exist");
    }

    return res.status(200).json(new ApiResponse(200, member, "Role changed to moderator successfully"));
});

const kickOutMember = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { profileId, memberId, serverId } = req.body;
    if (!memberId) {
        throw new ApiError(400, "Cannot get member Id");
    }
    if (!profileId) {
        throw new ApiError(400, "Cannot get profile Id");
    }
    if (!serverId) {
        throw new ApiError(400, "Cannot get server Id");
    }

    try {
        await Member.deleteOne({ _id: memberId });
    } catch (error) {
        throw new ApiError(400, "An error occurred while deleting member");
    }

    const profile: IProfile | null = await Profile.findOneAndUpdate(
        { _id: profileId },
        { $pull: { servers: serverId } },
        { new: true }
    );

    if (!profile) {
        throw new ApiError(400, "This profile does not exist");
    }

    return res.status(200).json(new ApiResponse(200, profile, "Member kicked out and server removed from profile successfully"));
});

export {
    getMembersByServerId,
    changeRoleToGuest,
    changeRoleToModerator,
    kickOutMember,
}