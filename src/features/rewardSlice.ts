import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import { RootState } from "../store";
import * as SecureStore from "expo-secure-store";
import { REWARD_DATA } from "../constants";


export type RewardData = {
    RID:string;
    
    category: string;
    supplierLogo: string; //using Firebase Storage to store the actual image files and storing references (URLs) to these images in Cloud Firestore
    supplierName: string;
    contactInfo: string;
    highlight: string;
    image: string; //using Firebase Storage to store the actual image files and storing references (URLs) to these images in Cloud Firestore
    name: string;
    price: number;
    qtyAvailable: number;
    status: string; //if this reward is discontinued but not delete from database then set to Discontinued (no longer available)
    termsConditions: string;
    validityStartDate: string;
    validityEndDate: string;
};

type RewardState = {
  data?: RewardData;
};

export const updateRewardData = createAsyncThunk(
  "user/updateRewardData",
  async (rewardData: RewardData) => {
    console.log(`Caching ${rewardData.name}'s data to Secure Store ...`);

    await SecureStore.setItemAsync(REWARD_DATA, JSON.stringify(rewardData));

    console.log(`Saved ${rewardData.name}'s data to Secure Store.`);

    return rewardData;
  }
);

export const fetchRewardData = createAsyncThunk(
  "reward/fetchRewardData",
  async (RID: string) => {
    const querySnapshot = await firestore()
      .collection("Rewards")
      .where("RID", "==", RID)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${RID} Either has no data or more than 1 data.`
      );
    }

    const rewardData = querySnapshot.docs[0].data() as RewardData;

    
    return rewardData;
  }
);

export const loadRewardDataFromStore = createAsyncThunk(
  "user/loadUserDataFromCache",
  async () => {
    let rewardDataJson: string | null = (await SecureStore.getItemAsync(
      REWARD_DATA
    )) as string | null;

    if (rewardDataJson) return JSON.parse(rewardDataJson);
    return rewardDataJson;
  }
);

const initialState = {} as RewardState;

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        fetchRewardData.fulfilled,
        (state, action: PayloadAction<RewardData>) => {
          state.data = action.payload;

          console.log(`Successfully fetched ${state.data.RID}'s data`);
        }
      )
      .addCase(fetchRewardData.rejected, (_, action) => {
        console.error(action.error);
      })
      
      .addCase(
        loadRewardDataFromStore.fulfilled,
        (state, action: PayloadAction<RewardData | null>) => {
          if (action.payload) {
            state.data = action.payload;
            console.log(
              `Successfully Loaded ${state.data.name}'s data from Secure Store.`
            );
          } else console.log("User data is undefined.");
        }
      )
      .addCase(loadRewardDataFromStore.rejected, () => {
        console.log("User data is undefined.");
      })
      .addCase(loadRewardDataFromStore.pending, () => {
        console.log("Loading user's data from cache ...");
      })
      .addCase(
        updateRewardData.fulfilled,
        (state, action: PayloadAction<RewardData>) => {
          state.data = action.payload;
        }
      );
  },
});

const selectRewardName = (state: RootState) => {
  if (state.reward.data) return state.reward.data.RID;

  console.warn("Reward's data is null or undefined.");
  return "";
};

export { selectRewardName };

export default rewardSlice.reducer;
