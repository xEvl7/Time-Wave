import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

{
  /* @todo Auto add creator to admin list */
}
export type CommunityProps = {
  id: string;
  logo?: string;
  name: string;
  description: string;
  admins: string[];
  volunteers: string[];
};

interface CommunityState {
  communities: CommunityProps[];
  loading: boolean;
  error: string | null;
  selectedCommunityId: string | null;
}

const initialState: CommunityState = {
  communities: [],
  loading: false,
  error: null,
  selectedCommunityId: null, // Initialize with null
};

export const createCommunity = createAsyncThunk(
  "community/createCommunity",
  async (communityInfo: CommunityProps) => {
    await firestore().collection("Communities").add(communityInfo);
    return communityInfo;
  }
);

// Fetch all communities
export const fetchCommunities = createAsyncThunk(
  "community/fetchCommunities",
  async () => {
    const snapshot = await firestore().collection("Communities").get();
    const communities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityProps[];
    return communities;
  }
);

// Check if user is an admin of any community
export const checkUserAdmin = createAsyncThunk(
  "community/checkUserAdmin",
  async (uid: string) => {
    const snapshot = await firestore().collection("Communities").get();
    const communities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityProps[];

    // console.log("communities",communities);
    const community = communities.find((community) =>
      community.admins.includes(uid)
    );
    console.log("community",community);
    // Return the community document ID or null
    return community ? community.id : null;
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState,
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

          state.communities.push(action.payload);
        }
      )
      .addCase(createCommunity.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCommunities.fulfilled,
        (state, action: PayloadAction<CommunityProps[]>) => {
          state.communities = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch communities";
      })
      .addCase(checkUserAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkUserAdmin.fulfilled,
        (state, action: PayloadAction<string | null>) => {
          state.loading = false;
          state.selectedCommunityId = action.payload;
        }
      )
      .addCase(checkUserAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to check user admin status";
      });
  },
});

export default communitySlice.reducer;
