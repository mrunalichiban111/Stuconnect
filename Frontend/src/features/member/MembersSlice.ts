import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import api from '@/app/api';
import { resetStore } from '@/app/resetActions';

export interface Member {
    _id: string;
    role: string;
    profileId: string;
    serverId: string;
}

interface MembersState {
    members: Member[];
    loading: boolean;
    error: string | null;
}

const initialState: MembersState = {
    members: [],
    loading: false,
    error: null,
};

interface FetchMembersPayload {
    serverId: string;
}

export const fetchMembers = createAsyncThunk<Member[], FetchMembersPayload, { rejectValue: string }>(
    'members/fetchMembers',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/members/getMembersByServerId', payload);
            return response.data.data as Member[];
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Error occurred while fetching members";
                return rejectWithValue(errorMessage);
            } else {
                return rejectWithValue('Error occurred while fetching members');
            }
        }
    }
);

const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
                state.members = action.payload;
                state.loading = false;
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetStore, () => initialState);
    },
});

export default membersSlice.reducer;
export const selectMembers = (state: RootState) => state.members.members;
