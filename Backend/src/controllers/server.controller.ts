import { Response } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from "../middleware/auth.middleware.js";

import Server, { IServer } from "../models/server.model.js";
import Member, { IMember, MemberRole } from "../models/member.model.js";
import Channel, { ChannelType, IChannel } from "../models/channel.model.js";
import Profile from "../models/profile.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";



// const getServersWhereUserIsMember = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const { profileId } = req.body;
//     if (!profileId) {
//         throw new ApiError(400, "Cannot get profile Id");
//     }

//     try {
//         const servers: IServer[] = await Server.aggregate([
//             {
//                 $lookup: {
//                     from: 'members',
//                     localField: '_id',
//                     foreignField: 'serverId',
//                     as: 'members'
//                 }
//             },
//             {
//                 $match: {
//                     'members.profileId': profileId
//                 }
//             },
//             {
//                 $project: {
//                     name: 1,
//                     serverImage: 1,
//                     inviteCode: 1,
//                     profileId: 1,
//                     channels: 1,
//                     createdAt: 1,
//                     updatedAt: 1
//                 }
//             }
//         ]);

//         return res.status(200).json(new ApiResponse(200, servers, "Servers fetched successfully"));
//     } catch (error) {
//         throw new ApiError(500, "An error occurred while fetching servers");
//     }
// });


const getServersWhereUserIsMember = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { profileId } = req.body;
    if (!profileId) {
      throw new ApiError(400, "Cannot get profile Id");
    }
    const members: IMember[] | null = await Member.find({ profileId }); 
    if (!members.length) {
      return res.status(200).json(new ApiResponse(200, [], "No servers found for this user"));
    }  
    const serverIds = members.map(member => member.serverId);  
    const servers: IServer[] | null = await Server.find({ _id: { $in: serverIds } });  
    return res.status(200).json(new ApiResponse(200, servers, "Servers fetched successfully"));
});


const createServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverName, profileId } = req.body;
    
    let serverImageLocalPath: string | undefined;
    if (req.files && !Array.isArray(req.files) && req.files.serverImage?.length > 0) {
        serverImageLocalPath = req.files.serverImage[0].path;
    }
    const serverImage = serverImageLocalPath ? await uploadOnCloudinary(serverImageLocalPath) : null;

    const server: IServer = await Server.create({
        name: serverName,
        serverImage: serverImage,
        inviteCode: uuidv4(),
        profileId: profileId,
        channels: [],
        members: []
    });

    if (!server) {
        throw new ApiError(400, "An error occurred while creating the server");
    }

    // Create a default "general" channel
    const generalChannel: IChannel = await Channel.create({
        name: 'general',
        type: ChannelType.TEXT,
        profileId: profileId,
        serverId: server._id
    });

    if (!generalChannel) {
        throw new ApiError(400, "An error occurred while creating the channel");
    }
    server.channels.push(generalChannel._id as mongoose.Types.ObjectId);

    // Add the creator as an admin member
    const adminMember: IMember = await Member.create({
        role: MemberRole.ADMIN,
        profileId: profileId,
        serverId: server._id
    });

    if (!adminMember) {
        throw new ApiError(400, "An error occurred while creating the member");
    }
    server.members.push(adminMember._id as mongoose.Types.ObjectId);

    const savedServer: IServer = await server.save();

    // Add server ID to the profile of the user
    await Profile.findByIdAndUpdate(
        profileId,
        {
            $push: { servers: savedServer._id }
        }
    );

    return res.status(200).json(
        new ApiResponse(200, savedServer, "Server created successfully")
    );
});

const joinServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { profileId, inviteCode } = req.body;
    if (!profileId) {
        throw new ApiError(400, "Cannot get profile Id");
    }
    if (!inviteCode) {
        throw new ApiError(400, "Cannot get invite code");
    }

    const server: IServer | null = await Server.findOne({ inviteCode });
    if (!server) {
        throw new ApiError(400, "Invalid invite code");
    }

    const profile = await Profile.findById(profileId);
    if (!profile) {
        throw new ApiError(400, "Profile not found");
    }

    // Check if the server ID is already in the profile's servers array
    if (profile.servers.includes(server._id as mongoose.Types.ObjectId)) {
        return res.status(200).json(
            new ApiResponse(200, server._id, "Already a member of the server")
        );
    }

    // Add server ID to profile's servers array
    await Profile.findByIdAndUpdate(
        profileId,
        {
            $push: { servers: server._id }
        }
    );

    // Create a new member for the server
    const guestMember: IMember = await Member.create({
        role: MemberRole.GUEST,
        profileId: profileId,
        serverId: server._id
    });
    if (!guestMember) {
        throw new ApiError(400, "An error occurred while creating the member");
    }

    // Add the new member to the server's members array
    server.members.push(guestMember._id as mongoose.Types.ObjectId);
    await server.save();

    return res.status(200).json(
        new ApiResponse(200, server._id, "Server joined successfully")
    );
});

const leaveServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId, profileId } = req.body;
    
    if (!profileId) {
        throw new ApiError(400, "Cannot get profile Id");
    }
    if (!serverId) {
        throw new ApiError(400, "Cannot get server Id");
    }

    try {
        // Remove server from profile's servers array
        await Profile.findByIdAndUpdate(
            profileId,
            { $pull: { servers: serverId } },
            { new: true }
        );

        // Delete the member record
        await Member.deleteOne({
            serverId: serverId,
            profileId: profileId
        });
    } catch (error) {
        throw new ApiError(400, "An error occurred while leaving the server");
    }

    return res.status(200).json(new ApiResponse(200, [], "Left server successfully"));
});


export {
    getServersWhereUserIsMember,
    createServer,
    joinServer,
    leaveServer
}