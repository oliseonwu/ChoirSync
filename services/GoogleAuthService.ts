import { GoogleUser } from "@/types/user.types";
import Parse from "./Parse";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { throwErrorWithMessage, throwError } from "@/utilities/Helpers";
export enum GoogleAuthError {
  CANCELED = "User canceled sign in",
  WRONG_SIGN_IN_METHOD = "Google Login failed: Account already exists for a different sign in method",
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
      throwError(error);
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
        throw new Error("Google Login failed");
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
      if (error.code === Parse.Error.USERNAME_TAKEN) {
        throw new Error(GoogleAuthError.WRONG_SIGN_IN_METHOD);
      }

      throwError(error);
    }
  }
}

export const googleAuthService = new GoogleAuthService();
