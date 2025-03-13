import AsyncStorage from "@react-native-async-storage/async-storage";

export enum AsyncStorageKeys {
  NOTIFICATION_STATUS = "NOTIFICATION_STATUS",
  PUSH_TOKEN = "PUSH_TOKEN",
  HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG = "HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG",
}

class AsyncStorageService {
  async setItem(key: AsyncStorageKeys, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in AsyncStorage:", error);
    }
  }

  async getItem(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from AsyncStorage:", error);
      return null;
    }
  }

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from AsyncStorage:", error);
    }
  }

  async clear() {
    try {
      await AsyncStorage.multiRemove(Object.values(AsyncStorageKeys));
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  }
}

export default new AsyncStorageService();
