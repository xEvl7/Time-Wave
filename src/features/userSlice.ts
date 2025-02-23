import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore, {
  firebase,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { USER_DATA } from "../constants";
import { RootState } from "../store";
import { DateTime } from "luxon";

type UserData = {
  uid: string;
  name: string;
  identityCardNumber: string;
  phoneNumber: string;
  emailAddress: string;
  points: number;
  logo: string | null;
  isFeedbackFilled: Boolean;
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
  date: FirebaseFirestoreTypes.Timestamp;
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

type UserState = {
  data?: UserData;
  contributionData?: { [year: string]: UserContributionData };
  pointsReceivedData?: PointsReceivedData[];
  pointsUsedData?: PointsUsedData[];
  activitiesData?: UserActivitiesData[];
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
    let userDataJson: string | null = (await SecureStore.getItemAsync(
      USER_DATA
    )) as string | null;

    if (userDataJson) return JSON.parse(userDataJson);
    return userDataJson;
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

      // Convert Date to string
      Object.keys(monthData).forEach((month) => {
        monthData[month].updatedDate = monthData[month].updatedDate.toString();
      });

      contributionData[year] = monthData;
    });

    const currentDate = new Date();
    const selectedYear = currentDate.getFullYear();
    const selectedMonth = currentDate.toLocaleString("en-US", {
      month: "short",
    });

    if (
      contributionData[selectedYear] &&
      contributionData[selectedYear][selectedMonth]
    ) {
      const totalContrHours =
        contributionData[selectedYear][selectedMonth].totalContrHours;

      if (totalContrHours !== undefined) {
        return contributionData;
      }
    }

    throw new Error("Data not available or in the expected format.");
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
          updatedDate: contribution.updatedDate.toDate().toISOString(),
        });
      });
    });

    console.log("groupedData", groupedData);

    return groupedData;
  }
);

export const fetchPointsReceivedData = createAsyncThunk(
  "user/fetchPointsReceivedData",
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

    const PointsReceivedCollection = await userDocument.ref
      .collection("PointsReceived")
      .orderBy("date", "desc")
      .get();

    // 获取用户的本地时区
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const activities: PointsReceivedData[] = [];

    // Iterate over each document in the "PointsReceived" sub-collection
    PointsReceivedCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().date;

      const timestampMillis =
        firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1e6;

      // Step 1: Interpret timestamp as if it were UTC+8
      const luxonDateTime = DateTime.fromMillis(timestampMillis, {
        zone: "Asia/Shanghai",
      }).plus({ hours: 0 }); // No additional offset since we treat it as UTC+8

      // Step 2: Convert to user’s local timezone
      const localDateTime = luxonDateTime.setZone(userTimeZone);

      const pointsReceivedData: PointsReceivedData = {
        date: localDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        time: localDateTime.toFormat("hh:mm a"), // "11:00 AM"
        points: doc.data().points,
      };

      activities.push(pointsReceivedData);
    });

    // Return the array of PointsReceivedData
    return activities;
  }
);

export const fetchPointsUsedData = createAsyncThunk(
  "user/fetchPointsUsedData",
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
    const PointsUsedCollection = await userDocument.ref
      .collection("PointsUsed")
      .orderBy("date", "desc")
      .get();

    // 获取用户的本地时区
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const activities: PointsUsedData[] = [];

    // Iterate over each document in the "PointsUsed" sub-collection
    PointsUsedCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().date;

      const timestampMillis =
        firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1e6;

      // Step 1: Interpret timestamp as if it were UTC+8
      const luxonDateTime = DateTime.fromMillis(timestampMillis, {
        zone: "Asia/Shanghai",
      }).plus({ hours: 0 }); // No additional offset since we treat it as UTC+8

      // Step 2: Convert to user’s local timezone
      const localDateTime = luxonDateTime.setZone(userTimeZone);

      // console.log("Original (Interpreted as UTC+8):", luxonDateTime.toString());
      // console.log("Converted to User Zone:", localDateTime.toString());

      const pointsUsedData: PointsUsedData = {
        date: localDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        time: localDateTime.toFormat("hh:mm a"), // "11:00 AM"
        points: doc.data().points,
      };

      activities.push(pointsUsedData);
    });

    // Return the array of PointsUsedData
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
    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", email)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(`${email} Either has no data or more than 1 data.`);
    }

    // 获取用户的本地时区
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const userDocument = querySnapshot.docs[0];

    // 创建活动查询的基础引用
    let activitiesRef = userDocument.ref.collection("Activities");

    // 如果 startDate 存在，则添加对应的 where 语句
    if (startDate) {
      const start = new Date(startDate).getTime(); // 转换为时间戳
      activitiesRef = activitiesRef.where("scanTime", ">=", new Date(start));
    }

    // 如果 endDate 存在，则添加对应的 where 语句
    if (endDate) {
      const end = new Date(endDate).getTime(); // 转换为时间戳
      activitiesRef = activitiesRef.where("scanTime", "<=", new Date(end));
    }

    // 添加排序
    activitiesRef = activitiesRef.orderBy("scanTime", "desc");

    const UserActivitiesCollection = await activitiesRef.get();

    // const start = new Date(startDate).getTime();
    // const end = new Date(endDate).getTime();

    // const UserActivitiesCollection = await userDocument.ref
    //   .collection("Activities")
    //   // .where('scanTime', '>=', start)
    //   // .where('scanTime', '<=', end)
    //   .orderBy("scanTime", "desc")
    //   .get();

    const activities: UserActivitiesData[] = [];

    // Iterate over each document in the "PointsUsed" sub-collection
    UserActivitiesCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().scanTime;

      const timestampMillis =
        firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1e6;

      // Step 1: Interpret timestamp as if it were UTC+8
      const luxonDateTime = DateTime.fromMillis(timestampMillis, {
        zone: "Asia/Shanghai",
      }).plus({ hours: 0 }); // No additional offset since we treat it as UTC+8

      // Step 2: Convert to user’s local timezone
      const localDateTime = luxonDateTime.setZone(userTimeZone);

      const userActivitiesData: UserActivitiesData = {
        activityId: doc.data().activityId || "Unknown Activity Id",
        activityName: doc.data().activityName || "Unknown Activity Name",
        communityId: doc.data().communityId || "Unknown Community Id",
        generateTime:
          doc.data().generateTime?.toDate()?.toLocaleString() || "N/A",
        scanDate: localDateTime.toFormat("EEE, d LLL yyyy") || "N/A",
        scanTime: localDateTime.toFormat("hh:mm a") || "N/A",
        type: doc.data().type || "Unknown Type",

        // date: luxonDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        // time: luxonDateTime.toFormat("hh:mm a"), // "11:00 AM"
        // points: doc.data().points,
      };

      activities.push(userActivitiesData);
    });

    // Return the array of PointsUsedData
    return activities;
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

      // 将用户本地时区的日期转换为 UTC 再存入 Firestore
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const utcDateTime = DateTime.fromJSDate(pointsReceivedData.date, {
        zone: userTimeZone,
      }).toUTC();

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
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState; // 获取 Redux 状态
      const currentUser = state.user.data; // 获取当前用户数据

      if (!currentUser?.emailAddress) {
        return rejectWithValue("User email not found");
      }

      const currentTime = firestore.Timestamp.fromDate(new Date());
      const pointsUsedData: PointsUsedData = {
        points: state.reward.data?.price || 0, // 确保 price 存在
        date: currentTime,
      };

      // 查询 Firestore 里的用户数据
      const userSnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", currentUser.emailAddress)
        .get();

      if (!userSnapshot.empty) {
        const userDocRef = userSnapshot.docs[0].ref;

        // 将数据存入 Firestore 的 "PointsUsed" 子集合
        await userDocRef.collection("PointsUsed").add(pointsUsedData);
        console.log("Points used data stored successfully.");
        return pointsUsedData;
      } else {
        return rejectWithValue("User not found in Firestore");
      }
    } catch (error: any) {
      console.error("Error storing points used data:", error);
      return rejectWithValue(error.message);
    }
  }
);

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
        }
      )
      .addCase(fetchUserContributionData.rejected, (_, action) => {
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
      .addCase(
        fetchPointsReceivedData.fulfilled,
        (state, action: PayloadAction<PointsReceivedData[]>) => {
          state.pointsReceivedData = action.payload;
          console.log(action.payload);
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
          console.log(action.payload);
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
          console.log(action.payload);
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

  console.warn("User's data is null or undefined.");
  return "";
};

export { selectUserName };

export default userSlice.reducer;
