import { ErrorCode } from "@/types/errors";
import Parse from "./Parse";
import { pointer } from "@/utilities/Helpers";

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
      throw new Error(error.message);
    }
  }

  /**
   * Get all group IDs the user is a member of.
   * @param userId - The ID of the user to get group IDs for
   * @returns An array of group IDs
   */
  async getUserGroupIds(userId: string) {
    try {
      const ChoirMembers = Parse.Object.extend("ChoirMembers");
      const query = new Parse.Query(ChoirMembers);
      query.equalTo("user_id", pointer(userId, "_User"));
      query.select("choir_groups_id");

      const result = await query.find();
      return {
        success: true,
        groupIds: result.map((member) => member.get("choir_groups_id").id),
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
