import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import { RootState } from "../store";
import * as SecureStore from "expo-secure-store";
import { REWARD_DATA } from "../constants";
import { DateTime } from "luxon";

// 定义奖励数据类型
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
};

// 定义 RewardState 类型，包含奖励数据和搜索查询
type RewardState = {
  data?: RewardData;
  allRewards: RewardData[]; // 所有奖励数据
  searchQuery: string; // 搜索查询
};

// 异步操作：更新奖励数据并保存到 Secure Store
export const updateRewardData = createAsyncThunk(
  "user/updateRewardData",
  async (rewardData: RewardData) => {
    console.log(`Caching ${rewardData.name}'s data to Secure Store ...`);
    await SecureStore.setItemAsync(REWARD_DATA, JSON.stringify(rewardData));
    console.log(`Saved ${rewardData.name}'s data to Secure Store.`);
    return rewardData;
  }
);

// // 异步操作：从 Firebase 获取奖励数据
// export const fetchRewardData = createAsyncThunk(
//   "reward/fetchRewardData",
//   async (RID: string) => {
//     const querySnapshot = await firestore()
//       .collection("Rewards")
//       .where("RID", "==", RID)
//       .get();

//     if (querySnapshot.size !== 1) {
//       throw new Error(`${RID} Either has no data or more than 1 data.`);
//     }

//     const rewardData = querySnapshot.docs[0].data() as RewardData;
//     return rewardData;
//   }
// );

// // 异步操作：从 Secure Store 加载奖励数据
// export const loadRewardDataFromStore = createAsyncThunk(
//   "user/loadUserDataFromCache",
//   async () => {
//     let rewardDataJson: string | null = await SecureStore.getItemAsync(REWARD_DATA);

//     if (rewardDataJson) return JSON.parse(rewardDataJson);
//     return rewardDataJson;
//   }
// );

// 异步操作：从 Firebase 获取奖励数据
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

    // 🔥 转换 `validityStartDate` 和 `validityEndDate`
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

// 异步操作：从 Secure Store 加载奖励数据
export const loadRewardDataFromStore = createAsyncThunk(
  "user/loadUserDataFromCache",
  async () => {
    let rewardDataJson: string | null = await SecureStore.getItemAsync(
      REWARD_DATA
    );

    if (rewardDataJson) {
      let rewardData = JSON.parse(rewardDataJson);

      // 🔥 确保数据可序列化
      return {
        ...rewardData,
        validityStartDate:
          typeof rewardData.validityStartDate === "string"
            ? rewardData.validityStartDate
            : null,
        validityEndDate:
          typeof rewardData.validityEndDate === "string"
            ? rewardData.validityEndDate
            : null,
      };
    }

    return null;
  }
);

// 分页加载 rewards（Lazy Load）
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

// 初始状态
const initialState: RewardState = {
  allRewards: [], // 初始化奖励数据为空
  searchQuery: "", // 初始化搜索查询为空
};

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    // 设置所有奖励数据
    setRewards: (state, action: PayloadAction<RewardData[]>) => {
      state.allRewards = action.payload;
    },
    // 设置搜索查询
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
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
          } else {
            console.log("User data is undefined.");
          }
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

// Selector: 获取奖励名称
const selectRewardName = (state: RootState) => {
  if (state.reward.data) return state.reward.data.RID;
  console.warn("Reward's data is null or undefined.");
  return "";
};

// Selector: 根据搜索查询过滤奖励数据
const selectFilteredRewards = (state: RootState) => {
  const { allRewards, searchQuery } = state.reward;

  // 通过搜索查询过滤奖励数据
  return allRewards.filter(
    (reward) =>
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export { selectRewardName, selectFilteredRewards };

export const { setRewards, setSearchQuery } = rewardSlice.actions;

export default rewardSlice.reducer;
