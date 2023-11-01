import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice";
import communityReducer from "./features/communitySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
