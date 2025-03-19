import { ErrorCode } from "@/types/errors";
import Parse from "./Parse";

class UserManagementService {
  async updateUserField(field: string, value: any) {
    try {
      const currentUser = await Parse.User.currentAsync();
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

  async deleteCurrentUser() {
    try {
      await Parse.Cloud.run("deleteCurrentUser");
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const userManagementService = new UserManagementService();
