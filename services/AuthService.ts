import { router } from "expo-router";
import { googleAuthService } from "./GoogleAuthService";
import Parse from "./Parse";
import { pointer } from "@/utilities/Helpers";

class AuthService {
  async getCurrentUser() {
    return Parse.User.currentAsync();
  }

  async logout() {
    try {
      await googleAuthService.signOut();
      await Parse.User.logOut();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async loginWithGoogle() {
    // we throw errors in GoogleAuthService, so we don't need to handle them here
    const googleResponse = await googleAuthService.signIn();

    if (!googleResponse.success) {
      throw new Error("Google sign in failed: " + googleResponse.error);
    }

    try {
      const { user: googleUser, idToken } = googleResponse.data!;
      const currentUser = await this.getCurrentUser();

      const userToLogin = currentUser || new Parse.User();
      if (!currentUser) {
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
        this.logout();
      }
      return { success: false, error: error.message };
    }
  }

  async verifyAuth() {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "User not logged in",
      };
    }
    return { success: true };
  }
}

export const authService = new AuthService();

/**
 * AuthService: Centralized authentication manager that:
 * - Centralizes all auth logic in one place
 * - Abstracts Parse authentication methods
 * - Provides consistent error handling
 * - Ensures type safety with TypeScript
 * - Enables code reuse across components
 */
