import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { USER_DATA } from "../constants";
import { RootState } from "../store";

type UserData = {
  uid: string;
  name: string;
  identityCardNumber: string;
  phoneNumber: string;
  emailAddress: string;
  points: number;
};

type UserContributionData = {
  [month: string]: {
    totalContrHours: number;
    updatedDate: any;
  };
};

type UserState = {
  data?: UserData;
  contributionData?: { [year: string]: UserContributionData };
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
      .collection("UserContribution")
      .get();

    // Now you can process the documents in the subcollection
    // const userContributionData: UserContributionData =
    //   {} as UserContributionData;

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

    // Now userContributionData contains the data from the "UserContribution" subcollection
    console.log(contributionData);
    // console.log(contributionData["2023"]["Oct"].totalContrHours);

    // Check if the keys and values exist before accessing them
    const selectedYear = "2023";
    const selectedMonth = "Oct";

    if (
      contributionData[selectedYear] &&
      contributionData[selectedYear][selectedMonth]
    ) {
      const totalContrHours =
        contributionData[selectedYear][selectedMonth].totalContrHours;

      if (totalContrHours !== undefined) {
        console.log(totalContrHours);

        // Uncomment the following line if you want to store the entire contributionData
        // await SecureStore.setItemAsync(USER_DATA, JSON.stringify(contributionData));

        return contributionData;
      }
    }

    throw new Error("Data not available or in the expected format.");
  }
);

// export const fetchContributionHours = createAsyncThunk(
//   "user/fetchContributionHours",
//   async ({ email, currentMonth }: { email: string; currentMonth: string }) => {
//     const querySnapshot = await firestore()
//       .collection("Users")
//       .where("emailAddress", "==", email)
//       .get();

//     if (querySnapshot.size !== 1) {
//       throw new Error(`${email} Either has no data or more than 1 data.`);
//     }

//     const userDocument = querySnapshot.docs[0];

//     // Reference to the UserContribution collection
//     const userContributionCollectionRef =
//       userDocument.ref.collection("UserContribution");

//     // Query the 2023 subcollection
//     const year2023Collection = await userContributionCollectionRef
//       .doc("2023")
//       .collection("Oct") // Assuming "Oct" is a subcollection
//       .get();

//     const contributionData: { [year: string]: UserContributionData } = {};

//     year2023Collection.docs.forEach((doc) => {
//       const year = doc.id;
//       const monthData = doc.data() as UserContributionData;

//       // Convert Date to string for each month if updatedDate is present and is a Date object
//       Object.keys(monthData).forEach((month) => {
//         const monthEntry = monthData[month];
//         if (monthEntry.updatedDate instanceof Date) {
//           monthEntry.updatedDate = monthEntry.updatedDate.toString();
//         }
//       });

//       contributionData[year] = monthData;
//     });

//     // Now userContributionData contains the data from the "UserContribution" subcollection
//     console.log(contributionData);

//     // await SecureStore.setItemAsync(USER_DATA, JSON.stringify(contributionData));
//     return contributionData;
//   }
// );

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

const initialState = {} as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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
        (state, action: PayloadAction<UserState>) => {
          // Ensure that you're correctly accessing the payload property
          state.contributionData = action.payload.contributionData;

          console.log(`Successfully fetched contribution data`);
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
