import Parse from "./Parse";

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
