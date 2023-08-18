import { CommunityProps } from "./features/communitySlice";

export type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined;
  SignUp: undefined;
  DisclaimerPrivacy: undefined;
  ForgotPassword: undefined;
  AppInfo: undefined;
  Benefits: undefined;
  HomePage: undefined;
  ScanPage: undefined;
  QrCodePage: undefined;
  CreateCommunity: undefined;
  SelectAdmin: undefined;
  Profile: undefined;
  CommunityInfo: CommunityProps;
};
