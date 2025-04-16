import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import { RootState } from "../store";
import * as SecureStore from "expo-secure-store";
import { REWARD_DATA } from "../constants";

// 定義獎勵數據類型
export type RewardData = {
  RID: string;
  category: string;
  supplierLogo: string;
  supplierName: string;
  contactInfo: string;
  highlight: string;
  image: string;
  name: string;
  price: number;
  qtyAvailable: number;
  status: string;
  termsConditions: string;
  validityStartDate: any;
  validityEndDate: any;
  forcommunities: string[];
};

// 定義 RewardState 類型，包含獎勵數據和搜索查詢
type RewardState = {
  data?: RewardData;
  allRewards: RewardData[];
  searchQuery: string;
};

// 異步操作：更新獎勵數據並保存到 Secure Store
export const updateRewardData = createAsyncThunk(
  "user/updateRewardData",
  async (rewardData: RewardData) => {
    console.log(`Caching ${rewardData.name}'s data to Secure Store ...`);
    await SecureStore.setItemAsync(REWARD_DATA, JSON.stringify(rewardData));
    console.log(`Saved ${rewardData.name}'s data to Secure Store.`);
    return rewardData;
  }
);

// 異步操作：從 Firebase 獲取獎勵數據
export const fetchRewardData = createAsyncThunk(
  "reward/fetchRewardData",
  async (RID: string) => {
    const querySnapshot = await firestore()
      .collection("Rewards")
      .where("RID", "==", RID)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(`${RID} Either has no data or more than 1 data.`);
    }

    const rewardData = querySnapshot.docs[0].data() as RewardData;

    return {
      ...rewardData,
      validityStartDate: rewardData.validityStartDate?.seconds
        ? new Date(rewardData.validityStartDate.seconds * 1000).toISOString()
        : null,
      validityEndDate: rewardData.validityEndDate?.seconds
        ? new Date(rewardData.validityEndDate.seconds * 1000).toISOString()
        : null,
    };
  }
);

// 異步操作：從 Secure Store 加載獎勵數據
export const loadRewardDataFromStore = createAsyncThunk(
  "user/loadUserDataFromCache",
  async () => {
    let rewardDataJson: string | null = await SecureStore.getItemAsync(REWARD_DATA);

    if (rewardDataJson) {
      let rewardData = JSON.parse(rewardDataJson);

      return {
        ...rewardData,
        validityStartDate: typeof rewardData.validityStartDate === "string"
          ? rewardData.validityStartDate
          : null,
        validityEndDate: typeof rewardData.validityEndDate === "string"
          ? rewardData.validityEndDate
          : null,
      };
    }

    return null;
  }
);

// 分頁加載 rewards（Lazy Load）
export const fetchRewardsPaginated = createAsyncThunk(
  "reward/fetchRewardsPaginated",
  async ({ limit, lastDoc }: { limit: number; lastDoc?: any }) => {
    let query = firestore()
      .collection("Rewards")
      .orderBy("validityEndDate")
      .limit(limit);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const querySnapshot = await query.get();
    const rewards = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      validityStartDate: doc.data().validityStartDate?.seconds
        ? new Date(doc.data().validityStartDate.seconds * 1000).toISOString()
        : null,
      validityEndDate: doc.data().validityEndDate?.seconds
        ? new Date(doc.data().validityEndDate.seconds * 1000).toISOString()
        : null,
    }));

    return {
      rewards,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  }
);

// 異步操作：更新獎勵庫存數量 
const updateRewardStock = createAsyncThunk(
  "reward/updateRewardStock",
  async ({ rewardId, qtyAvailable }: { rewardId: string; qtyAvailable: number }) => {
    try {
      const rewardRef = firestore().collection("Rewards").doc(rewardId);
      await rewardRef.update({ qtyAvailable });

      return { rewardId, qtyAvailable };
    } catch (error) {
      throw new Error("Failed to update reward stock");
    }
  }
);

// 初始狀態
const initialState: RewardState = {
  allRewards: [],
  searchQuery: "",
};

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    // 設置所有獎勵數據
    setRewards: (state, action: PayloadAction<RewardData[]>) => {
      state.allRewards = action.payload;
    },
    // 設置搜索查詢
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardData.fulfilled, (state, action: PayloadAction<RewardData>) => {
        state.data = action.payload;
        console.log(`Successfully fetched ${state.data.RID}'s data`);
      })
      .addCase(updateRewardStock.fulfilled, (state, action) => {
        const { rewardId, qtyAvailable } = action.payload;
        if (state.data && state.data.RID === rewardId) {
          state.data.qtyAvailable = qtyAvailable;
        }

        // 更新 `allRewards` 中的數量
        const rewardIndex = state.allRewards.findIndex((r) => r.RID === rewardId);
        if (rewardIndex !== -1) {
          state.allRewards[rewardIndex].qtyAvailable = qtyAvailable;
        }
      })
      .addCase(fetchRewardData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(loadRewardDataFromStore.fulfilled, (state, action: PayloadAction<RewardData | null>) => {
        if (action.payload) {
          state.data = action.payload;
          console.log(`Successfully Loaded ${state.data.name}'s data from Secure Store.`);
        } else {
          console.log("User data is undefined.");
        }
      })
      .addCase(loadRewardDataFromStore.rejected, () => {
        console.log("User data is undefined.");
      })
      .addCase(loadRewardDataFromStore.pending, () => {
        console.log("Loading user's data from cache ...");
      })
      .addCase(updateRewardData.fulfilled, (state, action: PayloadAction<RewardData>) => {
        state.data = action.payload;
      });
  },
});

// Selector: 獲取獎勵名稱
const selectRewardName = (state: RootState) => {
  if (state.reward.data) return state.reward.data.RID;
  console.warn("Reward's data is null or undefined.");
  return "";
};

// Selector: 根據搜索查詢過濾獎勵數據
const selectFilteredRewards = (state: RootState) => {
  const { allRewards, searchQuery } = state.reward;

  return allRewards.filter(
    (reward) =>
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export { selectRewardName, selectFilteredRewards };

export const { setRewards, setSearchQuery } = rewardSlice.actions;

export default rewardSlice.reducer;

export { updateRewardStock};
