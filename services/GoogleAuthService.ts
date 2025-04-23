import { GoogleUser } from "@/types/user.types";
import Parse from "./Parse";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

export enum GoogleAuthError {
  CANCELED = "User canceled sign in",
  FAILED = "Google sign in failed",
  INVALID_RESPONSE = "Invalid response from Google",
  NOT_HANDLED = "Google sign in not handled",
  UNKNOWN = "Unknown error with Google sign in",
  IN_PROGRESS = "Sign in already in progress",
  PLAY_SERVICES_NOT_AVAILABLE = "Play services not available",
}
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

  async socialLogin() {
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
        throw new Error(GoogleAuthError.CANCELED);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async socialSignOut() {
    const currentGoogleUser = GoogleSignin.getCurrentUser();

    if (currentGoogleUser) {
      await GoogleSignin.signOut();
    }
  }

  async getCurrentUser() {
    const currentGoogleUser = GoogleSignin.getCurrentUser();
    return currentGoogleUser;
  }

  async loginWithGoogle() {
    try {
      // First attempt Google sign in
      const googleResponse = await this.socialLogin();

      if (!googleResponse?.success || !("data" in googleResponse)) {
        throw new Error(GoogleAuthError.FAILED);
      }

      const { user: googleUser, idToken } = googleResponse.data;
      const parseUser = await Parse.User.currentAsync();

      const userToLogin = parseUser || new Parse.User();
      if (!parseUser) {
        userToLogin.set("username", googleUser.email);
        userToLogin.set("email", googleUser.email);
        userToLogin.set("firstName", googleUser.givenName);
        userToLogin.set("lastName", googleUser.familyName);
        userToLogin.set("profileUrl", googleUser.photo);
      }

      // linkWith will:
      // 1. Find existing user with this Google ID
      // 2. Log them in if found
      // 3. Create new user only if not found
      const loggedInUser = await userToLogin.linkWith("google", {
        authData: {
          id: googleUser.id,
          id_token: idToken,
        },
      });

      return { success: true, user: loggedInUser };
    } catch (error: Parse.Error | any) {
      if (
        error instanceof Parse.Error &&
        error.code === Parse.Error.ACCOUNT_ALREADY_LINKED
      ) {
        // Log out if account already linked
        const currentGoogleUser = GoogleSignin.getCurrentUser();
        if (currentGoogleUser) {
          await GoogleSignin.signOut();
        }
        await Parse.User.logOut();
      }

      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          throw new Error(GoogleAuthError.IN_PROGRESS);
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new Error(GoogleAuthError.PLAY_SERVICES_NOT_AVAILABLE);
        default:
          throw new Error(GoogleAuthError.FAILED + ": " + error.message);
      }
    }
    throw new Error(GoogleAuthError.UNKNOWN + ": " + error.message);
  }
}

export const googleAuthService = new GoogleAuthService();
