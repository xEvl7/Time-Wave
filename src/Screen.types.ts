import { CommunityProps } from "./features/communitySlice";

export type RootStackParamList = {
  SignUp: undefined;
  LogIn: undefined;
  ForgotPassword: undefined;
  DisclaimerPrivacy: undefined;

  Welcome: undefined;
  AppInfo: undefined;
  Benefits: undefined;

  HomePage: undefined;

  ScanPage: undefined;
  QrCodePage: undefined;

  CreateCommunity: undefined;
  SelectAdmin: undefined;
  CommunityInfo: CommunityProps;

  Profile: undefined;

  RewardsPage: undefined;
  PointsHistory: undefined;
  PointsPolicy: undefined;
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
