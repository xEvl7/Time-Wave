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
  HomeTabs: NavigatorScreenParams<BottomTabParamList>; // Include tabs inside the stack

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
  Communities: undefined;
  CommunityInfo: CommunityProps;
  ProfileInfo: { item: any };
  CommunityOptions: { item: any };
  // CommunityProfile: { item: any };

  MemberSeeAll: { item: any; member: any };
  SelectAdmin: undefined;
  AddAdmin: { item: any; member: any };

  CreateActivity: { item: any };
  EditActivity: { item: any };
  OngoingActivities: undefined;
  ActivityInfo: ActivityProps;
  ActivitySeeAll: { activities: any; item: any };

  // ActivitySeeAll: { item: any };

  Profile: undefined;
  Account: undefined;
  PointsHistory: undefined;
  PointsPolicy: { level: any };
  ContributionsHistory: undefined;
  ActivityHistory: undefined;
  RecentActivities: undefined;
  GoogleFormScreen: undefined;
  Setting: undefined;
  ChangeYourPassword: undefined;
  EditProfile: undefined;
  NewProfile: undefined;

  ApproveVolunteer: undefined;
  RemoveVolunteer: undefined;

  // reward section
  TimeBankRewards: undefined;
  RewardSeeAll: { data: RewardType[] };
  // RewardDetails: { item: { RID: string } };
  RewardDetails: {
    item: { RID: string, name: string };
    type?: string;
    redeemedCode?: string;
    expiredDate: any;
    redeemedDate: any;
    usedDate: any;
  };
  MyRewards: undefined;
  SplashScreen: undefined; // New splash screen added
};

export type BottomTabParamList = {
  Home: undefined;
  Activity: undefined;
  Rewards: undefined;
  Profile: undefined;
};
