import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice";
import communityReducer from "./features/communitySlice";
import rewardReducer from "./features/rewardSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    community: communityReducer,
    reward: rewardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
