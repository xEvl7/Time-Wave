export type RewardType = {
  // id: string;
  RID: string;
  image: string;
  name: string;
  supplierName: string;
  price: number;
};

export type CommunityType = {
  // id: string;
  logo: string;
  name: string;
  description: string;
};

export type RewardObtainedType = {
  rewardInfo: {
    image: string;
    supplierName: string;
    name: string;
  };
  expiredDate: any;
  redeemedDate: any;
  status: string;
  usedDate: any;
  reference: any;
};