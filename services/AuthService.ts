import { router } from "expo-router";
import { googleAuthService } from "./GoogleAuthService";
import Parse from "./Parse";
import { GoogleUser } from "@/types/user.types";
import { ErrorCode } from "@/types/errors";

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

export interface UserStatus {
  hasName: boolean;
  isMemberOfAnyChoir: boolean;
}

//The AuthService class is a central manager for all
// authentication-related operations in your app.
//Think of it as a dedicated helper that handles
// all the complexities of user authentication,
// including signup, login, logout, and error handling.

class AuthService {
  async signUp({ email, password, firstName, lastName }: SignUpData) {
    try {
      // Create a new Parse User
      const user = new Parse.User();
      user.set("username", email); // Using email as username
      user.set("email", email);
      user.set("password", password);
      user.set("firstName", firstName);
      user.set("lastName", lastName);

      // Sign up the user
      const signedUpUser = await user.signUp();

      return {
        success: true,
        user: signedUpUser,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

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

  async loginWithCredentials({ email, password }: LoginData) {
    try {
      const user = await Parse.User.logIn(email, password);
      return {
        success: true,
        user,
      };
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

    try {
      const { user: googleUser, idToken } = googleResponse.data!;
      const currentUser = await this.getCurrentUser();

      const userToLogin = currentUser || new Parse.User();
      if (!currentUser) {
        userToLogin.set("username", googleUser.email);
        userToLogin.set("email", googleUser.email);
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

  async getUserStatus(user: Parse.User): Promise<UserStatus> {
    const firstName = user.get("firstName");
    const lastName = user.get("lastName");
    const hasName = Boolean(firstName && lastName);

    const membershipResult = await authService.checkChoirMembership(user.id);
    if (!membershipResult.success) {
      throw new Error(
        membershipResult.error || "Failed to check choir membership"
      );
    }

    return {
      hasName,
      isMemberOfAnyChoir: membershipResult.isMember,
    };
  }

  async checkChoirMembership(userId: string) {
    try {
      // Create a pointer to the User
      const userPointer = {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      };

      // Query ChoirMembers
      const ChoirMembers = Parse.Object.extend("ChoirMembers");
      const query = new Parse.Query(ChoirMembers);
      query.equalTo("user_id", userPointer);

      const result = await query.first();

      return {
        success: true,
        isMember: !!result,
        choirMember: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        isMember: false,
      };
    }
  }

  navigateBasedOnUserStatus = (userStatus: UserStatus) => {
    if (!userStatus.hasName) {
      return router.navigate("/name");
    }
    return userStatus.isMemberOfAnyChoir
      ? router.navigate("/(tabs)")
      : router.navigate("/chooseYourPath");
  };
  // ... existing code ...

  async updateUserField(field: string, value: any) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: ErrorCode.NOT_LOGGED_IN,
        };
      }

      typeof value === "string" ? (value = value.trim()) : value;
      currentUser.set(field, value);
      await currentUser.save();

      return {
        success: true,
        user: currentUser,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
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

  // ... existing code ...
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
