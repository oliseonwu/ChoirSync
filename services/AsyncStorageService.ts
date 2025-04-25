import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Enum representing the keys used in AsyncStorage
 * @enum {string} NOTIFICATION_RESPONSE_ID - Id of the most recent notification the user clicked on
 * @enum {string} THIS_WEEK_NEW_SONG_ACCESS_DATE - Timestamp of the first access to the new songs page when this week's songs are available
 * @enum {string} THIS_WEEK_RECORDINGS_ACCESS_DATE - Timestamp of the first access to the this week's recordings page when this week's recordings are available
 * @enum {string} APPLE_USER_ID - Apple user ID
 * @enum {string} SIGN_IN_METHOD - Sign in method (apple, google, email)
 */
export enum AsyncStorageKeys {
  NOTIFICATION_STATUS = "NOTIFICATION_STATUS",
  PUSH_TOKEN = "PUSH_TOKEN",
  HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG = "HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG",
  NOTIFICATION_RESPONSE_ID = "NOTIFICATION_RESPONSE_ID",
  THIS_WEEK_RECORDINGS_ACCESS_DATE = "THIS_WEEK_RECORDINGS_ACCESS_DATE",
  THIS_WEEK_NEW_SONGS_ACCESS_DATE = "THIS_WEEK_NEW_SONGS_ACCESS_DATE",
  APPLE_USER_ID = "APPLE_USER_ID",
  SIGN_IN_METHOD = "SIGN_IN_METHOD",
}

/**
 * Enum representing the keys that should not be cleared from AsyncStorage
 * when the user logs out
 * @enum {string} NOTIFICATION_RESPONSE_ID - Notification response ID
 */
enum IgnoreOnClearKeys {
  NOTIFICATION_RESPONSE_ID = "NOTIFICATION_RESPONSE_ID",
  PUSH_TOKEN = "PUSH_TOKEN",
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

  /**
   * Clears all items from AsyncStorage except for the keys in IgnoreOnClearKeys
   * @returns void
   */
  async clear() {
    const keysToRemove = Object.keys(AsyncStorageKeys).filter(
      (key) => !Object.keys(IgnoreOnClearKeys).includes(key)
    );
    try {
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing all AsyncStorage items:", error);
    }
  }
}

export default new AsyncStorageService();
