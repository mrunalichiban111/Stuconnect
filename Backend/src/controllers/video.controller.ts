import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createLivekitVideoToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { roomName, participantName } = req.body;
    const { AccessToken } = await import('livekit-server-sdk');
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity: participantName,
        ttl: '10m',
    });
    at.addGrant({ roomJoin: true, room: roomName });

    return res.json(new ApiResponse(200, { token: await at.toJwt() }, "LiveKit token generated successfully"));
});

export {
    createLivekitVideoToken,
};
