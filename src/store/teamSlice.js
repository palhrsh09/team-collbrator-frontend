import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api_url = import.meta.env.VITE_API_URL;

export const fetchAllTeam   = createAsyncThunk(
  'team/fetchAllTeam',
  async ({ rejectWithValue }) => {
    try {
      const res = await axios.get(`${api_url}/api/v1/team`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch team');
    }
  }
);

export const fetchTeam = createAsyncThunk(
  'team/fetchTeam',
  async ({ teamId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api_url}/api/v1/team/${teamId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch team');
    }
  }
);

export const fetchActivityLogs = createAsyncThunk(
  'team/fetchActivityLogs',
  async ({ teamId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api_url}/api/v1/activity`, {
        withCredentials: true,
        params: { teamId },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch activity logs');
    }
  }
);

export const createTeam = createAsyncThunk(
  'team/createTeam',
  async ({ team }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${api_url}/api/v1/team`, team, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create team');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    team: null,
    activityLogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload.data;
      })
      .addCase(fetchAllTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
