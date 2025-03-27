import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import api from '@/app/api';
import { resetStore } from '@/app/resetActions';

interface Image {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    original_filename: string;
    api_key: string;
}

export interface Server {
    _id: string;
    name: string;
    serverImage: Image;
    inviteCode: string;
    profileId: string;
    members: string[];
    channels: string[];
}

interface ServersState {
    servers: Server[];
    loading: boolean;
    error: string | null;
}

const initialState: ServersState = {
    servers: [],
    loading: false,
    error: null,
};

interface FetchServersPayload {
    profileId: string;
}

const fetchServers = createAsyncThunk<Server[], FetchServersPayload, { rejectValue: string }>(
    'servers/fetchServers',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/servers/getServersWhereUserIsMember', payload);
            const servers = response.data.data.map((server: any) => ({
                _id: server._id,
                name: server.name,
                serverImage: server.serverImage,
                inviteCode: server.inviteCode,
                profileId: server.profileId,
                members: server.members,
                channels: server.channels,
            }));
            return servers as Server[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Error occurred while fetching servers";
                return rejectWithValue(errorMessage);
            } else {
                return rejectWithValue('Error occurred while fetching servers');
            }
        }
    }
);

const serversSlice = createSlice({
    name: 'servers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServers.fulfilled, (state, action: PayloadAction<Server[]>) => {
                state.servers = action.payload;
                state.loading = false;
            })
            .addCase(fetchServers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetStore, () => initialState);
    },
});

export { fetchServers };

export default serversSlice.reducer;

export const selectServers = (state: RootState) => state.server.servers;
