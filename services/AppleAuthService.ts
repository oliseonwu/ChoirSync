import * as AppleAuthentication from "expo-apple-authentication";
import Parse from "./Parse";
import AsyncStorageService, { AsyncStorageKeys } from "./AsyncStorageService";
import {
  decodeJWT,
  throwErrorWithMessage,
  throwError,
} from "@/utilities/Helpers";

export enum AppleAuthError {
  CANCELED = "Apple Login failed: The user canceled the authorization attempt",
  WRONG_SIGN_IN_METHOD = "Apple Login failed: Account already exists for a different sign in method",
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
    } catch (error: any) {
      throwError(error);
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
    } catch (error: any) {
      throwErrorWithMessage("Apple Social sign out failed: ", error);
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
      if (error.code === Parse.Error.EMAIL_TAKEN) {
        throw new Error(AppleAuthError.WRONG_SIGN_IN_METHOD);
      }
      throwErrorWithMessage("Apple Login failed: ", error);
    }
  }
}

export const appleAuthService = new AppleAuthService();
