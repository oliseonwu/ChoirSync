import Parse from "./Parse";

export enum EmailAuthError {
  FAILED = "Email sign in failed",
}

class EmailAuthService {
  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = await Parse.User.logIn(email, password);

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error(EmailAuthError.FAILED, error);
      throw new Error(EmailAuthError.FAILED + ": " + error.message);
    }
  }

  async checkUserExistsByEmail(email: string) {
    try {
      const result: { success: boolean; exists: boolean } =
        await Parse.Cloud.run("checkUserExistsByEmail", { email });
      return result;
    } catch (error: any) {
      console.error(EmailAuthError.FAILED, error);
      throw new Error(EmailAuthError.FAILED + ": " + error.message);
    }
  }

  async signUpWithEmailAndPassword(email: string, password: string) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = new Parse.User();
      user.set("username", email);
      user.set("email", email);
      user.set("password", password);

      await user.signUp();

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error(EmailAuthError.FAILED, error);
      throw new Error(EmailAuthError.FAILED + ": " + error.message);
    }
  }

  async forgotPassword(email: string) {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const result = await Parse.Cloud.run("forgotPassword", { email });
      return result;
    } catch (error: any) {
      console.error(EmailAuthError.FAILED, error);
      throw new Error(EmailAuthError.FAILED + ": " + error.message);
    }
  }

  async verifyOtpCode(email: string, otpCode: string) {
    try {
      if (!email || !otpCode) {
        throw new Error("Email and OTP code are required");
      }

      const result = await Parse.Cloud.run("verifyOtpCode", {
        email,
        code: otpCode,
      });
      return result;
    } catch (error: any) {
      console.error(EmailAuthError.FAILED, error);
      throw new Error(EmailAuthError.FAILED + ": " + error.message);
    }
  }

  async resetPassword(email: string, newPassword: string) {
    try {
      if (!email || !newPassword) {
        throw new Error("Email and new password are required");
      }

      const result = await Parse.Cloud.run("resetPassword", {
        email,
        newPassword,
      });
      return result;
    } catch (error: any) {
      console.error(EmailAuthError.FAILED, error);
      throw new Error(EmailAuthError.FAILED + ": " + error.message);
    }
  }
}

export const emailAuthService = new EmailAuthService();
