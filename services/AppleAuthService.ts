import * as AppleAuthentication from "expo-apple-authentication";
import Parse from "./Parse";
import AsyncStorageService, { AsyncStorageKeys } from "./AsyncStorageService";

class AppleAuthService {
  private async socialLogin() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        return {
          success: true,
          data: {
            id: credential.user,
            identityToken: credential.identityToken,
            authorizationCode: credential.authorizationCode,
            fullName: credential.fullName,
            email: credential.email,
          },
        };
      } else {
        return { success: false, error: "Failed to get Apple credentials" };
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  async socialSignOut() {
    try {
      const appleUserId = await AsyncStorageService.getItem(
        AsyncStorageKeys.APPLE_USER_ID
      );

      if (!appleUserId) {
        throw new Error("Social sign out failed: Apple user ID not found");
      }

      await AppleAuthentication.signOutAsync({
        user: appleUserId,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async loginWithApple() {
    try {
      const appleResponse = await this.socialLogin();

      if (!appleResponse.success) {
        throw new Error(
          "Apple sign in failed: " + (appleResponse as { error: string }).error
        );
      }

      // If we get here, we know appleResponse is successful and has data
      const successResponse = appleResponse as {
        success: true;
        data: {
          id: string;
          identityToken: string | null;
          authorizationCode: string | null;
          fullName: AppleAuthentication.AppleAuthenticationFullName | null;
          email: string | null;
        };
      };
      const { id, identityToken, fullName, email } = successResponse.data;

      const userToLogin = new Parse.User();

      userToLogin.set("username", email);
      userToLogin.set("email", email);
      if (fullName) {
        userToLogin.set("firstName", fullName.givenName);
        userToLogin.set("lastName", fullName.familyName);
      }

      const loggedInUser = await userToLogin.linkWith("apple", {
        authData: {
          id,
          token: identityToken,
        },
      });

      await AsyncStorageService.setItem(AsyncStorageKeys.APPLE_USER_ID, id);

      return { success: true, user: loggedInUser };
    } catch (error: Parse.Error | any) {
      console.log("error:", error);

      if (
        error instanceof Parse.Error &&
        error.code === Parse.Error.ACCOUNT_ALREADY_LINKED
      ) {
        // Log out user if account already linked
        await Parse.User.logOut();
      }
      return { success: false, error: error.message };
    }
  }

  private handleError(error: any) {
    if (error.code) {
      switch (error.code) {
        case "ERR_CANCELED":
          return { success: false, error: "User canceled Apple sign in" };
        case "ERR_FAILED":
          return { success: false, error: "Apple sign in failed" };
        case "ERR_INVALID_RESPONSE":
          return { success: false, error: "Invalid response from Apple" };
        case "ERR_NOT_HANDLED":
          return { success: false, error: "Apple sign in not handled" };
        case "ERR_UNKNOWN":
          return { success: false, error: "Unknown error with Apple sign in" };
        default:
          return { success: false, error: "Sign in failed" };
      }
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export const appleAuthService = new AppleAuthService();
