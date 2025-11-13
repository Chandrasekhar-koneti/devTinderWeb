import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    connections: [],
    requests: [],
  },
  reducers: {
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
  },
});

export const { setConnections, setRequests } = connectionSlice.actions;
export default connectionSlice.reducer;
