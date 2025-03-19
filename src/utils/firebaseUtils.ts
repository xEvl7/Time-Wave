import { firebase } from "@react-native-firebase/firestore";
import { CommunityType, RewardType } from "../types";

// Rewards
export const fetchRewardsData = async (): Promise<RewardType[]> => {
  try {
    const response = await firebase.firestore().collection("Rewards").get();
    return response.docs.map((doc) => doc.data() as RewardType);
  } catch (error) {
    console.error("Error fetching rewards data:", error);
    return [];
  }
};

// Communities
export const fetchCommunitiesData = async (): Promise<CommunityType[]> => {
  try {
    const response = await firebase.firestore().collection("Communities").get();
    return response.docs.map((doc) => doc.data() as CommunityType);
  } catch (error) {
    console.error("Error fetching communities data:", error);
    return [];
  }
};

// Any collection ( not good )
// export const fetchDataFromFirestore = async (collection: string) => {
//   try {
//     const response = await firebase.firestore().collection(collection).get();
//     return response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error(`Error fetching ${collection} data:`, error);
//     return [];
//   }
// };
