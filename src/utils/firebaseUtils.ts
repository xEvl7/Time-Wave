import { firebase } from "@react-native-firebase/firestore";
import {
  CommunityType,
  RewardCodesType,
  RewardObtainedType,
  RewardType,
} from "../types";

// Rewards
export const fetchActiveRewardsData = async (): Promise<RewardType[]> => {
  try {
    const response = await firebase
      .firestore()
      .collection("Rewards")
      .where("status", "==", "active")
      .orderBy("createdDate", "desc")
      .get();
    console.log("Successfully fetched reward's data");
    return response.docs.map((doc) => doc.data() as RewardType);
  } catch (error) {
    console.error("Error fetching rewards data:", error);
    return [];
  }
};

export const fetchRewardCodesDataByRID = async (
  RID?: string
): Promise<RewardCodesType[]> => {
  try {
    // 获取顶层 Rewards 集合
    const rewardsSnapshot = await firebase
      .firestore()
      .collection("Rewards")
      .doc(RID)
      .collection("Codes")
      .get();

    if (rewardsSnapshot.empty) {
      console.log(`No codes found for RID: ${RID}`);
      return [];
    }

    const codes = rewardsSnapshot.docs.map((doc) => ({
      code: doc.id,
      ...doc.data(),
      rewardId: RID,
    })) as unknown as RewardCodesType[];

    console.log(
      `Successfully fetched reward codes data for RID: ${RID}`,
      codes
    );
    return codes;
  } catch (error) {
    console.error("Error fetching rewards data:", error);
    return [];
  }
};

export const redeemRandomVoucherCode = async (
  RID: string,
  price: number,
  emailAddress: string | undefined // 改为 email，与 fetchRewardsObtainedData 一致
): Promise<RewardCodesType | null> => {
  try {
    const db = firebase.firestore();

    // 查询用户文档
    const userSnapshot = await db
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (userSnapshot.size !== 1) {
      console.log(
        `User with email ${emailAddress} not found or multiple found`
      );
      return null;
    }
    const userDoc = userSnapshot.docs[0];
    const userDocId = userDoc.id;
    // const uid = userDoc.data().uid;

    // 查询未使用的 codes
    const codesSnapshot = await db
      .collection("Rewards")
      .doc(RID)
      .collection("Codes")
      .where("status", "==", "unclaimed")
      .get();

    if (codesSnapshot.empty) {
      console.log(`No unclaimed codes found for RID: ${RID}`);
      return null;
    }

    // 随机选择一个 code
    const codes = codesSnapshot.docs;
    const randomIndex = Math.floor(Math.random() * codes.length);
    const selectedCodeDoc = codes[randomIndex];
    const selectedCode = selectedCodeDoc.id;
    const codeData = selectedCodeDoc.data() as RewardCodesType;

    // Log expiresAt for debugging
    console.log(
      `Selected code: ${selectedCode}, expiresAt:`,
      codeData.expiresAt,
      `Type: ${typeof codeData.expiresAt}`
    );

    // 验证过期时间
    if (codeData.expiresAt && new Date(codeData.expiresAt) < new Date()) {
      console.log(`Selected code ${selectedCode} has expired`);
      await db
        .collection("Rewards")
        .doc(RID)
        .collection("Codes")
        .doc(selectedCode)
        .update({ status: "expired" });
      return null;
    }

    // 使用事务更新 Codes , RewardsObtained & PointsUsed
    const codeRef = db
      .collection("Rewards")
      .doc(RID)
      .collection("Codes")
      .doc(selectedCode);
    const rewardObtainedRef = db
      .collection("Users")
      .doc(userDocId)
      .collection("RewardsObtained")
      .doc(); // 新文档，自动生成 ID
    const pointsUsedRef = db
      .collection("Users")
      .doc(userDocId)
      .collection("PointsUsed")
      .doc(); // 新文档，自动生成 ID

    return await db.runTransaction(async (transaction) => {
      const codeDoc = await transaction.get(codeRef);

      if (!codeDoc.exists) {
        console.log(`Code ${selectedCode} no longer exists`);
        return null;
      }

      const currentData = codeDoc.data() as RewardCodesType;
      if (currentData.status !== "unclaimed") {
        console.log(`Code ${selectedCode} is no longer unclaimed`);
        return null;
      }

      // 更新 Codes 文档
      const updatedCodeData = {
        status: "claimed",
        claimedBy: userDocId,
        claimedAt: new Date().toISOString(),
      };
      transaction.update(codeRef, updatedCodeData);

      // 当前时间
      // const now = firebase.firestore.Timestamp.now();
      const now = new Date();

      // 1个月后
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      // 转换成 Firebase Timestamp
      const expiredDate = firebase.firestore.Timestamp.fromDate(oneMonthLater);

      // 添加到 RewardsObtained
      const rewardObtainedData = {
        code: selectedCode,
        reference: RID,
        redeemedDate: firebase.firestore.Timestamp.fromDate(now),
        // expiredDate: codeData.expiresAt
        //   ? codeData.expiresAt
        //   : null,
        expiredDate: expiredDate,
        usedDate: null,
        status: "active",
      };
      transaction.set(rewardObtainedRef, rewardObtainedData);

      // 添加到 PointsUsed
      const pointsUsedData = {
        date: firebase.firestore.Timestamp.fromDate(now),
        points: price,
        reference: rewardObtainedRef.id,
      };
      transaction.set(pointsUsedRef, pointsUsedData);

      console.log(
        `Successfully redeemed code ${selectedCode} for user ${userDocId}`
      );
      return {
        code: selectedCode,
        status: updatedCodeData.status,
        createdAt: codeData.createdAt,
        expiresAt: codeData.expiresAt?.toDate()?.toISOString() || "N/A",
        claimedBy: updatedCodeData.claimedBy,
        claimedAt: updatedCodeData.claimedAt,
        rewardId: RID,
      } as RewardCodesType;
    });
  } catch (error) {
    console.error(`Error redeeming random code for RID: ${RID}`, error);
    return null;
  }
};

export const updateRewardsObtained = async (
  redeemedCode: string,
  emailAddress: string | undefined
): Promise<any> => {
  try {
    const db = firebase.firestore();

    // 查询用户文档
    const userSnapshot = await db
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (userSnapshot.size !== 1) {
      console.log(
        `User with email ${emailAddress} not found or multiple found`
      );
      return null;
    }

    const userDocId = userSnapshot.docs[0].id;

    // 查询 RewardsObtained 中 code 匹配的文档（限制最多1个）
    const rewardObtainedQuerySnapshot = await db
      .collection("Users")
      .doc(userDocId)
      .collection("RewardsObtained")
      .where("code", "==", redeemedCode)
      .limit(1)
      .get();

    if (rewardObtainedQuerySnapshot.empty) {
      console.log(`RewardObtained ${redeemedCode} not exists`);
      return null;
    }

    const rewardObtainedRef = rewardObtainedQuerySnapshot.docs[0].ref;

    const result = await db.runTransaction(async (transaction) => {
      const rewardSnap = await transaction.get(rewardObtainedRef);
      const currentData = rewardSnap.data() as RewardObtainedType;

      if (currentData.status !== "active") {
        console.log(`RewardObtained ${redeemedCode} is no longer active`);
        // 抛出异常让外层catch
        throw new Error("RewardObtained is no longer active");
      }

      let now = firebase.firestore.Timestamp.now();
      transaction.update(rewardObtainedRef, {
        status: "used",
        usedDate: now,
      });

      console.log(
        `Updated RewardObtained ${redeemedCode} for user ${userDocId}`
      );
      return now;
    });
    return result;
  } catch (error) {
    console.error(
      `Error updating RewardObtained for redeemedCode: ${redeemedCode}`,
      error
    );
    return null;
  }
};

// Communities
export const fetchCommunitiesData = async (): Promise<CommunityType[]> => {
  try {
    const response = await firebase.firestore().collection("Communities").get();
    console.log("Successfully fetched communities's data");
    return response.docs.map((doc) => ({
      id:doc.id,
      ...doc.data(),
    }))  as CommunityType[];
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
