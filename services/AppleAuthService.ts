import * as AppleAuthentication from "expo-apple-authentication";
import Parse from "./Parse";
import AsyncStorageService, { AsyncStorageKeys } from "./AsyncStorageService";
import { decodeJWT } from "@/utilities/Helpers";

export enum AppleAuthError {
  CANCELED = "User canceled sign in",
  FAILED = "Apple sign in failed",
  INVALID_RESPONSE = "Invalid response from Apple",
  NOT_HANDLED = "Apple sign in not handled",
  UNKNOWN = "Unknown error with Apple sign in",
}

class AppleAuthService {
  private async socialLogin() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
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
    } catch (error) {
      this.handleError(error);
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
      let decodedToken: any;

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

      decodedToken = decodeJWT(identityToken || "");

      const userToLogin = new Parse.User();

      // Some t
      userToLogin.set("username", email);
      userToLogin.set("email", decodedToken.email);
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
      return this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.code) {
      switch (error.code) {
        case "ERR_CANCELED":
          throw new Error(AppleAuthError.CANCELED);
        case "ERR_FAILED":
          throw new Error(AppleAuthError.FAILED);
        case "ERR_INVALID_RESPONSE":
          throw new Error(AppleAuthError.INVALID_RESPONSE);
        case "ERR_NOT_HANDLED":
          throw new Error(AppleAuthError.NOT_HANDLED);
        case "ERR_UNKNOWN":
          throw new Error(AppleAuthError.UNKNOWN);
      }
    }
    throw new Error("Apple sign in failed : " + error.message);
  }
}

export const appleAuthService = new AppleAuthService();
