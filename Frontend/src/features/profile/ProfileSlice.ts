import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api';
import { RootState } from '@/app/store';
import { displayError, extractErrorMessage } from '@/lib/utils';
import { resetStore } from '@/app/resetActions';

export interface Profile {
    _id: string,
    userId: string,
    username: string,
    imageUrl: string | null,
    email: string,
    servers: string[] | null,
    members: string[] | null,
    channels: string[] | null,
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ProfileState {
    profile: Profile | null,
    loading: boolean,
    error: string | null,
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
}

export const fetchProfile = createAsyncThunk<Profile, void, { rejectValue: string }>('profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('profiles/getUserProfile');
            return response.data.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = extractErrorMessage(error.response.data)
                displayError(errorMessage)
                return rejectWithValue(error.response.data);
            } else {
                displayError("Failed to fetch user")
                return rejectWithValue('Failed to fetch user');
            }
        }
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
            state.profile = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(fetchProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload ?? 'An error occurred while fetching profile';
        })
        .addCase(resetStore, () => initialState);
    }
})

export const selectUserProfile = (state: RootState) => state.profile.profile

export default profileSlice.reducer;