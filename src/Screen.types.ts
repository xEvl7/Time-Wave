import { NavigatorScreenParams } from "@react-navigation/native";
import { CommunityProps } from "./features/communitySlice";
import { ActivityProps } from "./features/activitySlice";
import { RewardType } from "./types";

export type RootStackParamList = {
  SignUp: undefined;
  LogIn: undefined;
  ForgotPassword: undefined;
  DisclaimerPrivacy: undefined;

  Welcome: undefined;
  AppInfo: undefined;
  AppInfo2: undefined;
  Benefits: undefined;

  // HomeTabs: undefined; // This is the nested tab navigator
  HomeTabs: NavigatorScreenParams<BottomTabParamList>; // 👈 Include tabs inside the stack

  ScanPage: undefined;
  QrCodePage: undefined;
  AdminControl: undefined;

  // CreateCommunity: undefined;
  CreateCommunity: {
    selectedAdmins: Array<{
      id: number;
      name: string;
      avatar: any;
      uid: string;
    }>;
  };
  CreateActivity: { item: any };
  SelectAdmin: undefined;
  CommunityInfo: CommunityProps;
  ProfileInfo: { item: any };
  Communities: undefined;
  // CommunityProfile: { item: any };
  ActivityInfo: ActivityProps;
  OngoingActivities: undefined;
  ActivitySeeAll: {activities:any,item: any};
  MemberSeeAll: { item: any, member:any };
  AddAdmin: { item:any, member:any };

  ActivitySeeAll: { item: any };
  MemberSeeAll: { item: any; member: any };
  AddAdmin: { item: any; member: any };
  CreateActivity: { item: any };
  EditActivity: { item: any };

  Profile: undefined;

  Account: undefined;
  PointsHistory: undefined;
  PointsPolicy: { level: any };
  ContributionsHistory: undefined;
  ActivityHistory: undefined;
  RecentActivities: undefined;

  ActiveRewardsDetailsUseNowPage: undefined;
  ActiveRewardsDetailsPage: undefined;
  ActiveRewardsPage: undefined;
  MedicalServicesPage: undefined;
  MyRewardsDetailsPage: undefined;
  MyRewardsPage: undefined;
  PastRewardsDetailsPage: undefined;
  PastRewardsPage: undefined;
  RewardSeeAll: {  data: RewardType[] };
  RewardsDetailsPage: undefined;
  TimeBankRewardsPage: undefined;
  Reward: { item: { RID: string } };
  GoogleFormScreen: undefined;
  Setting: undefined;
  ChangeYourPassword: undefined;
  EditProfile: undefined;
  NewProfile: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Activity: undefined;
  Rewards: undefined;
  Profile: undefined;
};
