import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import connectionReducer from "./slices/connectionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionReducer,
  },
});

export default store;
