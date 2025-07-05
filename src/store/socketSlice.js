import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    instance: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.instance = action.payload;
    },
    clearSocket: (state) => {
      state.instance?.disconnect?.();
      state.instance = null;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
