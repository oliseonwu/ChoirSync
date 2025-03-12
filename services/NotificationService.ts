import Parse from "./Parse";

interface StorePushTokenParams {
  token: string;
}

class NotificationService {
  async storePushToken(params: StorePushTokenParams) {
    try {
      const result = await Parse.Cloud.run("storePushToken", params);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const notificationService = new NotificationService();
