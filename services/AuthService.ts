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
    return Parse.User.current();
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

  async login({ email, password }: LoginData) {
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
