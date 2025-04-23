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

  private async socialLogin() {
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
    // First attempt Google sign in
    const googleResponse = await this.socialLogin();

    if (!googleResponse.success) {
      throw new Error("Google sign in failed: " + googleResponse.error);
    }

    try {
      const { user: googleUser, idToken } = googleResponse.data!;
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
      console.log("error:", error);

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
      return { success: false, error: error.message };
    }
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
}

export const googleAuthService = new GoogleAuthService();
