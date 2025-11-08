import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { USER_DATA } from "../constants";
import { RootState } from "../store";
import { DateTime } from "luxon";

type UserData = {
  uid: string;
  name: string;
  // identityCardNumber: string;
  phoneNumber: string;
  emailAddress: string;
  points: number;
  logo: string | null;
  isFeedbackFilled: Boolean;
  adminOf: string[];
  volunteerOf: string[];
};

type UserContributionData = {
  [month: string]: {
    totalContrHours: number;
    updatedDate: any;
  };
};

interface UserContribution {
  // year: string;
  month: string;
  totalContrHours: number;
  updatedDate: any;
}

type PointsReceivedData = {
  date: any;
  time: any;
  points: number;
};

type PointsReceivedData2 = {
  date: any;
  points: number;
};

type PointsUsedData = {
  date: any;
  time: any;
  points: number;
};

type PointsUsedData2 = {
  date: any;
  points: number;
};

type UserActivitiesData = {
  activityId: string;
  activityName: string;
  communityId: string;
  generateTime: any;
  scanDate: any;
  scanTime: any;
  type: string;
};

type RewardsObtainedData = {
  reference: any;
  redeemedDate: any;
  expiredDate: any;
  status: string;
  usedDate: any;
  rewardInfo: any;
  code: string;
};
type RewardsActiveData = {
  reference: any;
  redeemedDate: any;
  expiredDate: any;
  status: string;
  usedDate: any;
  rewardInfo: any;
  code: string;
};
type RewardsPastData = {
  reference: any;
  redeemedDate: any;
  expiredDate: any;
  status: string;
  usedDate: any;
  rewardInfo: any;
  code: string;
};

type UserState = {
  data?: UserData;
  contributionData?: { [year: string]: UserContributionData };
  pointsReceivedData?: PointsReceivedData[];
  pointsUsedData?: PointsUsedData[];
  activitiesData?: UserActivitiesData[];
  rewardsActiveData?: RewardsActiveData[];
  rewardsPastData?: RewardsPastData[];
};

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (userData: UserData) => {
    console.log(`Caching ${userData.name}'s data to Secure Store ...`);
    await SecureStore.setItemAsync(USER_DATA, JSON.stringify(userData));
    console.log(`Saved ${userData.name}'s data to Secure Store.`);
    return userData;
  }
);

// 更新用户积分的异步 thunk
export const updateUserPoints = createAsyncThunk(
  "user/updateUserPoints",
  async (
    { emailAddress, points }: { emailAddress: string; points: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.user.data;

      if (!currentUser?.emailAddress) {
        return rejectWithValue("User email not found");
      }

      const userSnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", emailAddress)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].ref;
        await userDoc.update({ points });

        console.log("Latest user's points: ", points);

        return { emailAddress, points }; // 返回更新后的数据
      } else {
        return rejectWithValue("User not found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (emailAddress: string) => {
    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userData = querySnapshot.docs[0].data() as UserData;
    await SecureStore.setItemAsync(USER_DATA, JSON.stringify(userData));
    return userData;
  }
);

export const loadUserDataFromStore = createAsyncThunk(
  "user/loadUserDataFromCache",
  async () => {
    let userDataJson: string | null = await SecureStore.getItemAsync(USER_DATA);
    if (userDataJson) return JSON.parse(userDataJson);
    return null;
  }
);

// 定义用于清除用户数据的 Redux Thunk 函数
export const clearUserData = createAsyncThunk(
  "user/clearUserData",
  async () => {
    await SecureStore.deleteItemAsync(USER_DATA);
  }
);

export const fetchUserContributionData = createAsyncThunk(
  "user/fetchUserContributionData",
  async (emailAddress: string) => {
    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userDocument = querySnapshot.docs[0];
    const userContributionCollection = await userDocument.ref
      .collection("Contributions")
      .get();

    const contributionData: { [year: string]: UserContributionData } = {} as {
      [year: string]: UserContributionData;
    };

    userContributionCollection.forEach((doc) => {
      const year = doc.id;
      const monthData = doc.data() as UserContributionData;

      // Convert Date to string and handle undefined updatedDate
      Object.keys(monthData).forEach((month) => {
        if (monthData[month].updatedDate) {
          monthData[month].updatedDate =
            monthData[month].updatedDate.toString();
        }
      });

      contributionData[year] = monthData;
    });

    const currentDate = new Date();
    const selectedYear = currentDate.getFullYear().toString(); // 确保与 contributionData 的 key 匹配
    const selectedMonth = currentDate.toLocaleString("en-US", {
      month: "short",
    });

    // 处理 totalContrHours 可能为 undefined 的情况
    if (
      contributionData[selectedYear] &&
      contributionData[selectedYear][selectedMonth]
    ) {
      const totalContrHours =
        contributionData[selectedYear][selectedMonth].totalContrHours ?? 0; // 使用 ?? 0 处理 undefined

      // 更新数据，确保 totalContrHours 不是 undefined
      contributionData[selectedYear][selectedMonth].totalContrHours =
        totalContrHours;

      return contributionData;
    }

    return contributionData; // 直接返回数据，不抛出错误
  }
);

export const fetchUserContributionData2 = createAsyncThunk(
  "user/fetchUserContributionData",
  async (emailAddress: string) => {
    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userDocument = querySnapshot.docs[0];
    const userContributionCollection = await userDocument.ref
      .collection("Contributions")
      .get();

    // get all history
    const groupedData: { [year: string]: UserContribution[] } = {};

    userContributionCollection.forEach((doc) => {
      const year = doc.id;
      const monthData = doc.data() as Record<string, UserContribution>;

      Object.keys(monthData).forEach((month) => {
        const contribution = monthData[month];
        if (!groupedData[year]) {
          groupedData[year] = [];
        }
        groupedData[year].push({
          month,
          totalContrHours: contribution.totalContrHours,
          updatedDate: contribution.updatedDate && typeof contribution.updatedDate.toDate === "function"
    ? contribution.updatedDate.toDate().toISOString()
    : "",
        });
      });
    });

    // console.log("groupedData", groupedData);

    return groupedData;
  }
);

export const fetchPointsReceivedData = createAsyncThunk(
  "user/fetchPointsReceivedData",
  async (emailAddress: string) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();
    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userDocument = querySnapshot.docs[0];
    const PointsReceivedCollection = await userDocument.ref
      .collection("PointsReceived")
      .orderBy("date", "desc")
      .get();
    const activities: PointsReceivedData[] = [];

    PointsReceivedCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().date;

      const timestampMillis =
        firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1e6;

      const localDateTime = DateTime.fromMillis(timestampMillis, {
        zone: userTimeZone,
      });

      const pointsReceivedData: PointsReceivedData = {
        date: localDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        time: localDateTime.toFormat("hh:mm a"), // "11:00 AM"
        points: doc.data().points,
      };

      activities.push(pointsReceivedData);
    });

    return activities;
  }
);

export const fetchPointsUsedData = createAsyncThunk(
  "user/fetchPointsUsedData",
  async (emailAddress: string) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userDocument = querySnapshot.docs[0];
    const PointsUsedCollection = await userDocument.ref
      .collection("PointsUsed")
      .orderBy("date", "desc")
      .get();
    const activities: PointsUsedData[] = [];

    PointsUsedCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().date;

      const timestampMillis =
        firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1e6;

      const localDateTime = DateTime.fromMillis(timestampMillis, {
        zone: userTimeZone,
      });

      const pointsUsedData: PointsUsedData = {
        date: localDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        time: localDateTime.toFormat("hh:mm a"), // "11:00 AM"
        points: doc.data().points,
      };

      activities.push(pointsUsedData);
    });

    return activities;
  }
);

export const fetchUserActivitiesData = createAsyncThunk(
  "user/fetchUserActivitiesData",
  async ({
    email,
    startDate,
    endDate,
  }: {
    email: string;
    startDate: string | null;
    endDate: string | null;
  }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", email)
      .get();
    if (querySnapshot.size !== 1) {
      throw new Error(`${email} Either has no data or more than 1 data.`);
    }

    const userDocument = querySnapshot.docs[0];
    let activitiesRef: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
      userDocument.ref.collection("Activities");
    if (startDate) {
      const start = new Date(startDate).getTime();
      activitiesRef = activitiesRef.where("scanTime", ">=", new Date(start));
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      activitiesRef = activitiesRef.where("scanTime", "<=", new Date(end));
    }
    activitiesRef = activitiesRef.orderBy("scanTime", "desc");

    const UserActivitiesCollection = await activitiesRef.get();
    const activities: UserActivitiesData[] = [];

    UserActivitiesCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().scanTime;

      const timestampMillis =
        firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1e6;

      const localDateTime = DateTime.fromMillis(timestampMillis, {
        zone: userTimeZone,
      });

      const userActivitiesData: UserActivitiesData = {
        activityId: doc.data().activityId || "Unknown Activity Id",
        activityName: doc.data().activityName || "Unknown Activity Name",
        communityId: doc.data().communityId || "Unknown Community Id",
        generateTime:
          doc.data().generateTime?.toDate()?.toLocaleString() || "N/A",
        scanDate: localDateTime.toFormat("EEE, d LLL yyyy") || "N/A",
        scanTime: localDateTime.toFormat("hh:mm a") || "N/A",
        type: doc.data().type || "Unknown Type",
      };

      activities.push(userActivitiesData);
    });

    return activities;
  }
);

export const fetchRewardsObtainedData = createAsyncThunk(
  "user/fetchRewardsObtainedData",
  async (params: {
    email: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const { email, type, startDate, endDate } = params;

    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", email)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(`${email} Either has no data or more than 1 data.`);
    }

    const userDocument = querySnapshot.docs[0];
    let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
      userDocument.ref.collection("RewardsObtained");

    if (type === "active") {
      query = query.where("status", "==", "active");
    } else if (type === "past") {
      query = query.where("status", "in", ["used", "expired"]);
    } else {
      return null;
    }

    // Convert Date to Firestore Timestamp
    if (startDate) {
      query = query.where(
        "redeemedDate",
        ">=",
        firestore.Timestamp.fromDate(startDate)
      );
    }

    if (endDate) {
      query = query.where(
        "redeemedDate",
        "<=",
        firestore.Timestamp.fromDate(endDate)
      );
    }

    query = query.orderBy("redeemedDate", "desc");

    const rewardObtainedSnapshot = await query.get();
    const rewardObtainedData: RewardsObtainedData[] = [];

    // 遍历每个 RewardsObtained 数据，并动态查询对应的 Rewards 数据
    for (const doc of rewardObtainedSnapshot.docs) {
      const rewardObtained = doc.data();
      const rewardId = rewardObtained.reference;

      // console.log("rewardId",rewardId);
      // 动态查询对应的 Rewards 数据
      const rewardDocSnapshot = await firestore()
        .collection("Rewards")
        .where("RID", "==", rewardId)
        .get();

      let rewardInfo = null;
      if (!rewardDocSnapshot.empty) {
        // 如果有结果，获取文档数据
        rewardInfo = rewardDocSnapshot.docs[0].data();

        // 处理 Firestore Timestamp，转换为字符串
        if (rewardInfo.createdDate) {
          rewardInfo.createdDate = rewardInfo.createdDate
            .toDate()
            .toISOString();
        }
        if (rewardInfo.validityEndDate) {
          rewardInfo.validityEndDate = rewardInfo.validityEndDate
            .toDate()
            .toISOString();
        }
        if (rewardInfo.validityStartDate) {
          rewardInfo.validityStartDate = rewardInfo.validityStartDate
            .toDate()
            .toISOString();
        }
      }

      // 构造 rewardObtainedData 对象并将奖励信息合并
      const data: RewardsObtainedData = {
        reference: rewardObtained.reference || "N/A",
        expiredDate:
          rewardObtained.expiredDate?.toDate()?.toISOString() || "N/A",
        redeemedDate:
          rewardObtained.redeemedDate?.toDate()?.toISOString() || "N/A",
        usedDate: rewardObtained.usedDate?.toDate()?.toISOString() || "N/A",
        status: rewardObtained.status || "N/A",
        rewardInfo: rewardInfo || null, // 将奖励信息添加到数据中
        code: rewardObtained.code || "N/A",
      };

      rewardObtainedData.push(data);
      console.log("rewardObtainedData", data);
    }

    return rewardObtainedData;
  }
);

export const storePointsReceivedDataToFirebase = createAsyncThunk(
  "user/storePointsReceivedDataToFirebase",
  async (
    pointsReceivedData: PointsReceivedData2,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.user.data;

      if (!currentUser?.emailAddress) {
        return rejectWithValue("User email not found");
      }

      // 确保 `date` 是 JavaScript `Date`
      const localDate =
        pointsReceivedData.date instanceof Date
          ? pointsReceivedData.date
          : new Date(pointsReceivedData.date);

      // 转换成 UTC 存入 Firestore
      const utcDateTime = DateTime.fromJSDate(localDate).toUTC();
      const firestoreTimestamp = firestore.Timestamp.fromDate(
        utcDateTime.toJSDate()
      );

      // 需要存储的积分数据
      const serializedPointsReceivedData = {
        date: firestoreTimestamp,
        points: pointsReceivedData.points,
      };

      // 先通过 emailAddress 查找用户文档
      const userSnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", currentUser.emailAddress)
        .get();

      if (!userSnapshot.empty) {
        // 获取用户文档的引用
        const userDocRef = userSnapshot.docs[0].ref;

        // 存入 "PointsReceived" 子集合
        await userDocRef
          .collection("PointsReceived")
          .add(serializedPointsReceivedData);

        return pointsReceivedData; // 成功后返回数据
      } else {
        return rejectWithValue("User not found in Firestore");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      return rejectWithValue(errorMessage);
    }
  }
);

export const storePointsUsedDataToFirebase = createAsyncThunk(
  "user/storePointsUsedDataToFirebase",
  async (pointsUsedData: PointsUsedData2, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.user.data;

      if (!currentUser?.emailAddress) {
        return rejectWithValue("User email not found");
      }

      // 确保 `date` 是 JavaScript `Date`
      const localDate =
        pointsUsedData.date instanceof Date
          ? pointsUsedData.date
          : new Date(pointsUsedData.date);

      // 转换成 UTC 存入 Firestore
      const utcDateTime = DateTime.fromJSDate(localDate).toUTC();
      const firestoreTimestamp = firestore.Timestamp.fromDate(
        utcDateTime.toJSDate()
      );

      // 需要存储的积分数据
      const serializedPointsReceivedData = {
        date: firestoreTimestamp,
        points: pointsUsedData.points,
      };

      // 先通过 emailAddress 查找用户文档
      const userSnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", currentUser.emailAddress)
        .get();

      if (!userSnapshot.empty) {
        // 获取用户文档的引用
        const userDocRef = userSnapshot.docs[0].ref;

        // 存入 "PointsUsed" 子集合
        await userDocRef
          .collection("PointsUsed")
          .add(serializedPointsReceivedData);

        return pointsUsedData; // 成功后返回数据
      } else {
        return rejectWithValue("User not found in Firestore");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      return rejectWithValue(errorMessage);
    }
  }
);

// export const storePointsUsedDataToFirebase = createAsyncThunk(
//   "user/storePointsUsedDataToFirebase",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState; // 获取 Redux 状态
//       const currentUser = state.user.data; // 获取当前用户数据

//       if (!currentUser?.emailAddress) {
//         return rejectWithValue("User email not found");
//       }

//       const currentTime = firestore.Timestamp.fromDate(new Date());
//       const pointsUsedData: PointsUsedData2 = {
//         points: state.reward.data?.price || 0, // 确保 price 存在
//         date: currentTime,
//       };

//       // 查询 Firestore 里的用户数据
//       const userSnapshot = await firestore()
//         .collection("Users")
//         .where("emailAddress", "==", currentUser.emailAddress)
//         .get();

//       if (!userSnapshot.empty) {
//         const userDocRef = userSnapshot.docs[0].ref;

//         // 将数据存入 Firestore 的 "PointsUsed" 子集合
//         await userDocRef.collection("PointsUsed").add(pointsUsedData);
//         console.log("Points used data stored successfully.");
//         return pointsUsedData;
//       } else {
//         return rejectWithValue("User not found in Firestore");
//       }
//     } catch (error: any) {
//       console.error("Error storing points used data:", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const updateIsFeedbackFilled = createAsyncThunk(
  "user/updateIsFeedbackFilled",
  async ({
    emailAddress,
    status,
  }: {
    emailAddress: string;
    status: boolean;
  }) => {
    if (!emailAddress) {
      throw new Error("Email is undefined");
    }

    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    console.log(
      "🔥 Firestore Query Result:",
      querySnapshot.docs.map((doc) => doc.data())
    );

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userDocument = querySnapshot.docs[0]; // 获取文档
    const userId = userDocument.id; // 获取用户的 document ID

    console.log("📌 Updating User ID:", userId);

    await firestore().collection("Users").doc(userId).set(
      {
        isFeedbackFilled: status,
      },
      { merge: true } // 只更新 `isFeedbackFilled` 字段，不影响其他数据
    );

    return { emailAddress, isFeedbackFilled: status };
  }
);

export const logOut = () => ({
  type: "user/logOut",
});

const initialState = {} as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut(state, action) {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.data = action.payload;
          console.log(`Successfully fetched ${state.data.name}'s data`);
        }
      )
      .addCase(fetchUserData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        fetchUserContributionData.fulfilled,
        (
          state,
          action: PayloadAction<{ [year: string]: UserContributionData }>
        ) => {
          state.contributionData = action.payload;
          console.log(`Successfully fetched User Contribution's data`);
          // console.log(state.contributionData);
        }
      )
      .addCase(fetchUserContributionData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        fetchRewardsObtainedData.fulfilled,
        (
          state,
          action: ReturnType<typeof fetchRewardsObtainedData.fulfilled>
        ) => {
          // state.rewardsObtainedData = action.payload; // Update the general rewards data
          console.log("Successfully fetched User Rewards Obtained's data");

          // Dynamically assign rewards based on status passed in action.meta.arg
          const type = action.meta.arg.type;

          if (type === "past") {
            // console.log(action.payload);
            state.rewardsPastData = action.payload ?? []; // 确保不是 null
          } else if (type === "active") {
            state.rewardsActiveData = action.payload ?? [];
          } else {
            console.warn("Invalid type:", type);
          }
        }
      )

      .addCase(fetchRewardsObtainedData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        loadUserDataFromStore.fulfilled,
        (state, action: PayloadAction<UserData | null>) => {
          if (action.payload) {
            state.data = action.payload;
            console.log(
              `Successfully Loaded ${state.data.name}'s data from Secure Store.`
            );
          } else console.log("User data is undefined.");
        }
      )
      .addCase(loadUserDataFromStore.rejected, () => {
        console.log("User data is undefined.");
      })
      .addCase(loadUserDataFromStore.pending, () => {
        console.log("Loading user's data from cache ...");
      })
      .addCase(
        updateUserData.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.data = action.payload;
        }
      )
      .addCase(updateUserPoints.pending, () => {
        console.log("Updating user's points ...");
      })
      .addCase(
        updateUserPoints.fulfilled,
        (
          state,
          action: PayloadAction<{ emailAddress: string; points: number }>
        ) => {
          if (
            state.data &&
            state.data.emailAddress === action.payload.emailAddress
          ) {
            state.data.points = action.payload.points;
          }
          console.log("Updated user's points.");
        }
      )
      .addCase(updateUserPoints.rejected, () => {
        console.log("User data is undefined.");
      })
      .addCase(
        fetchPointsReceivedData.fulfilled,
        (state, action: PayloadAction<PointsReceivedData[]>) => {
          state.pointsReceivedData = action.payload;
          // console.log(action.payload);
          console.log(`Successfully fetched User Points Received's data`);
        }
      )
      .addCase(fetchPointsReceivedData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        fetchPointsUsedData.fulfilled,
        (state, action: PayloadAction<PointsUsedData[]>) => {
          state.pointsUsedData = action.payload;
          // console.log(action.payload);
          console.log(`Successfully fetched User Points Used's data`);
        }
      )
      .addCase(fetchPointsUsedData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        fetchUserActivitiesData.fulfilled,
        (state, action: PayloadAction<UserActivitiesData[]>) => {
          state.activitiesData = action.payload;
          // console.log(action.payload);
          console.log(`Successfully fetched User Activities's data`);
        }
      )
      .addCase(fetchUserActivitiesData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        storePointsReceivedDataToFirebase.fulfilled,
        (state, action: PayloadAction<PointsReceivedData2>) => {
          console.log("Successfully stored points received data to Firebase");
        }
      )
      .addCase(storePointsReceivedDataToFirebase.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(storePointsUsedDataToFirebase.fulfilled, (state, action) => {
        console.log("Successfully stored points used data to Firebase");
      })
      .addCase(storePointsUsedDataToFirebase.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        updateIsFeedbackFilled.fulfilled,
        (
          state,
          action: PayloadAction<{
            emailAddress: string;
            isFeedbackFilled: boolean;
          }>
        ) => {
          const { emailAddress, isFeedbackFilled } = action.payload;
          if (state.data?.emailAddress === emailAddress) {
            state.data.isFeedbackFilled = isFeedbackFilled;
          }
        }
      );
  },
});

const selectUserName = (state: RootState) => {
  if (state.user.data) return state.user.data.name;

  // console.warn("User's data is null or undefined.");
  return "";
};

const selectEmail = (state: RootState) => {
  if (state.user.data) return state.user.data.emailAddress;

  // console.warn("User's data is null or undefined.");
  return "";
};

const selectUserData = (state: RootState) => {
  if (state.user.data) return state.user.data;

  // console.warn("User's data is null or undefined.");
  return null;
};

const selectUserContributionData = (state: RootState) => {
  if (state.user.contributionData) return state.user.contributionData;

  // console.warn("User Contribution's data is null or undefined.");
  return null;
};

export {
  selectUserName,
  selectEmail,
  selectUserData,
  selectUserContributionData,
};

export default userSlice.reducer;
