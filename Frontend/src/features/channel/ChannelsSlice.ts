import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import api from '@/app/api';
import { resetStore } from '@/app/resetActions';

export interface Channel {
    _id: string;
    name: string;
    type: string;
    profileId: string;
}

interface ChannelsState {
    channels: Channel[];
    loading: boolean;
    error: string | null;
}

const initialState: ChannelsState = {
    channels: [],
    loading: false,
    error: null,
};

interface FetchChannelsPayload {
    serverId: string;
}

export const fetchChannels = createAsyncThunk<Channel[], FetchChannelsPayload, { rejectValue: string }>(
    'channels/fetchChannels',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/channels/getChannelsByServerId', payload);
            return response.data.data as Channel[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Error occurred while fetching channels";
                return rejectWithValue(errorMessage);
            } else {
                return rejectWithValue('Error occurred while fetching channels');
            }
        }
    }
);

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChannels.fulfilled, (state, action: PayloadAction<Channel[]>) => {
                state.channels = action.payload;
                state.loading = false;
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetStore, () => initialState);
    },
});

export default channelsSlice.reducer;
export const selectChannels = (state: RootState) => state.channels.channels;
