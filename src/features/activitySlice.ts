import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

{
  /* @todo Auto add creator to admin list */
}
export type ActivityProps = {
  id: string;
  logo?: string;
  name: string;
  description: string;
  //tac: string;
  //location:string;
  //generated_time:;
  //end_time:;
  //admins: string[];
};

interface ActivityState {
  communities: ActivityProps[];
  loading: boolean;
  error: string | null;
  selectedActivityId: string | null;
}

const initialState: ActivityState = {
  communities: [],
  loading: false,
  error: null,
  selectedActivityId: null, // Initialize with null
};

export const createActivity = createAsyncThunk(
  "community/createCommunity",
  async (activityInfo: ActivityProps) => {
    await firestore().collection("Activities").add(activityInfo);
    return activityInfo;
  }
);

// Fetch all communities
export const fetchActivities = createAsyncThunk(
  "community/fetchActivities",
  async () => {
    const snapshot = await firestore().collection("Activities").get();
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityProps[];
    return activities;
  }
);

// Check if user is an admin of any community
// export const checkUserAdmin = createAsyncThunk(
//   "community/checkUserAdmin",
//   async (uid: string) => {
//     const snapshot = await firestore().collection("Communities").get();
//     const communities = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as ActivityProps[];

//     // console.log("communities",communities);
//     const community = communities.find((community) =>
//       community.admins.includes(uid)
//     );
//     console.log("community",community);
//     // Return the community document ID or null
//     return community ? community.id : null;
//   }
// );

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createActivity.pending, () => {
        console.log("Creating activity ...");
      })
      .addCase(
        createActivity.fulfilled,
        (state, action: PayloadAction<ActivityProps>) => {
          console.log(`Successfully created ${action.payload.name} activity.`);

          state.communities.push(action.payload);
        }
      )
      .addCase(createActivity.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActivities.fulfilled,
        (state, action: PayloadAction<ActivityProps[]>) => {
          state.communities = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch communities";
      })
      // .addCase(checkUserAdmin.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(
      //   checkUserAdmin.fulfilled,
      //   (state, action: PayloadAction<string | null>) => {
      //     state.loading = false;
      //     state.selectedCommunityId = action.payload;
      //   }
      // )
      // .addCase(checkUserAdmin.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error =
      //     action.error.message ?? "Failed to check user admin status";
      // });
  },
});

export default activitySlice.reducer;
