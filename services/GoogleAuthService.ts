import { GoogleUser } from "@/types/user.types";
import Parse from "./Parse";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

class GoogleAuthService {
  configure() {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
      offlineAccess: false,
      forceCodeForRefreshToken: true,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
      scopes: ["https://www.googleapis.com/auth/userinfo.email"],
    });
  }

  async signIn() {
    const currentUser = GoogleSignin.getCurrentUser();

    try {
      if (currentUser) {
        await GoogleSignin.signOut();
      }
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: "Sign in cancelled" };
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  async signOut() {
    const currentGoogleUser = GoogleSignin.getCurrentUser();

    if (currentGoogleUser) {
      await GoogleSignin.signOut();
    }
  }

  async getCurrentUser() {
    const currentGoogleUser = GoogleSignin.getCurrentUser();
    return currentGoogleUser;
  }

  private handleError(error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          throw { success: false, error: "Sign in already in progress" };
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw { success: false, error: "Play services not available" };
        default:
          throw { success: false, error: "Sign in failed" };
      }
    }
    return { success: false, error: "Unknown error occurred" };
  }
  async getUserByGoogleId(googleId: string): Promise<Parse.User | undefined> {
    const query = new Parse.Query(Parse.User);
    query.equalTo("authData.google.id", googleId);
    const user = await query.first();
    return user;
  }
}

export const googleAuthService = new GoogleAuthService();
