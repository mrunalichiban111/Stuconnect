import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useParams, useNavigate } from "react-router-dom";

const AudioRoom = () => {
    const params = useParams()
    const navigate = useNavigate()
    const token: string | undefined = params.audioId
    console.log(params.videoId);
    const handleLeaveRoom = () => {
        navigate('/')
    }
    
    return (
    <>
        <LiveKitRoom
            video={false}
            audio={true}
            token={token}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL}
            // Use the default LiveKit theme for nice styles.
            data-lk-theme="default"
            style={{ height: '100vh' }}
            onDisconnected={handleLeaveRoom}
            >
            <MyAudioConference />
            <RoomAudioRenderer />
            <ControlBar />
        </LiveKitRoom>
    </>
    );
}

function MyAudioConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Microphone, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}

export default AudioRoom