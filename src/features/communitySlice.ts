import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

{
  /* @todo Auto add creator to admin list */
}
export type CommunityProps = {
  name: string;
  description: string;
  admins: string[];
};

export const createCommunity = createAsyncThunk(
  "community/createCommunity",
  async (communityInfo: CommunityProps) => {
    await firestore().collection("Communities").add(communityInfo);

    return communityInfo;
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState: [] as CommunityProps[],
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createCommunity.pending, () => {
        console.log("Creating community ...");
      })
      .addCase(
        createCommunity.fulfilled,
        (state, action: PayloadAction<CommunityProps>) => {
          console.log(`Successfully created ${action.payload.name} community.`);

          state.push(action.payload);
        }
      )
      .addCase(createCommunity.rejected, (_, action) => {
        console.error(action.error);
      });
  },
});

export default communitySlice.reducer;
