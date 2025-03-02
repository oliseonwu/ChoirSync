import { ErrorCode } from "@/types/errors";
import Parse from "./Parse";
import * as ImageManipulator from "expo-image-manipulator";

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

  async updateProfileImage(imageUri: string) {
    try {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        return {
          success: false,
          error: ErrorCode.NOT_LOGGED_IN,
        };
      }

      // Compress and resize image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();
      const parseFile = new Parse.File("profile-image.jpg", blob);

      await parseFile.save();
      currentUser.set("profileImage", parseFile);
      await currentUser.save();

      return {
        success: true,
        user: currentUser,
        imageUri: manipulatedImage.uri,
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
