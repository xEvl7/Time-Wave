import { CommunityProps } from "./features/communitySlice";

export type RootStackParamList = {
  SignUp: undefined;
  LogIn: undefined;
  ForgotPassword: undefined;
  DisclaimerPrivacy: undefined;

  Welcome: undefined;
  AppInfo: undefined;
  Benefits: undefined;

  HomeTabs: undefined; // This is the nested tab navigator

  ScanPage: undefined;
  QrCodePage: undefined;
  AdminControl: undefined;

  // CreateCommunity: undefined;
  CreateCommunity: {
    selectedAdmins: Array<{ id: number; name: string; avatar: any }>;
  };
  SelectAdmin: undefined;
  CommunityInfo: CommunityProps;
  Comunities: undefined;
  CommunityProfile: undefined;
  ActivityInfo: undefined;
  ComingActivities: undefined;

  Profile: undefined;

  Account: undefined;
  PointsHistory: undefined;
  PointsPolicy: { level: any };
  ContributionsHistory: undefined;

  ActiveRewardsDetailsUseNowPage: undefined;
  ActiveRewardsDetailsPage: undefined;
  ActiveRewardsPage: undefined;
  MedicalServicesPage: undefined;
  MyRewardsDetailsPage: undefined;
  MyRewardsPage: undefined;
  PastRewardsDetailsPage: undefined;
  PastRewardsPage: undefined;
  RewardsDetailsPage: undefined;
  TimeBankRewardsPage: undefined;
};

export type BottomTabParamList = {
  HomePage: undefined;
  PointsHistory: undefined;
  TimeBankRewardsPage: undefined;
  Profile: undefined;
};
