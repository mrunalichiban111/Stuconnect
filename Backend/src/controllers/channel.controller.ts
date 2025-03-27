import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Channel, { ChannelType, IChannel } from "../models/channel.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Server from "../models/server.model.js";


const getChannelsByServerId = asyncHandler(async(req: AuthRequest, res: Response) => {
    const { serverId } = req.body;
    if(!serverId){
        throw new ApiError(400, "Cannot get server Id");
    }

    const channels: IChannel[] | null = await Channel.find({ serverId })
    if (!channels.length) {
        return res.status(200).json(new ApiResponse(200, [], "No channels found for this server"));
    }  

    return res.status(200).json(new ApiResponse(200, channels, "Channels fetched successfully"));
})

const createChannel = asyncHandler(async(req: AuthRequest, res: Response) => {
    const { serverId, profileId, channelType, channelName } = req.body;

    if(!(serverId && profileId && channelType && channelName)){
        throw new ApiError(400, "Cannot get data");
    }

    if (!Object.values(ChannelType).includes(channelType)) {
        throw new ApiError(400, "Invalid channel type");
    }

    const existingChannel: IChannel | null = await Channel.findOne({
        serverId: serverId,
        name: channelName
    }); 
    if(existingChannel){
        throw new ApiError(400, "A channel with this name already exist please use another name");
    }

    const channel: IChannel | null = await Channel.create({
        name: channelName,
        type: channelType,
        profileId: profileId,
        serverId: serverId
    })
    if (!channel) {
        throw new ApiError(400, "An error occurred while creating the channel");
    }

    await Server.findByIdAndUpdate(
        serverId,
        { $push: { channels: channel._id } },
        { new: true },
    );

    return res.status(200).json(new ApiResponse(200, [], "Channel created successfully"));
}) 

const deleteChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { channelId, serverId } = req.body;

    if (!channelId || !serverId) {
        throw new ApiError(400, "Channel ID and Server ID are required");
    }

    // Find the channel
    const channel: IChannel | null = await Channel.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // Remove the channel from the server's list of channels
    await Server.findByIdAndUpdate(
        serverId,
        { $pull: { channels: channelId } },
        { new: true }
    );

    // Delete the channel
    await Channel.findByIdAndDelete(channelId);

    return res.status(200).json(new ApiResponse(200, [], "Channel deleted successfully"));
});

export {
    getChannelsByServerId,
    createChannel,
    deleteChannel
}