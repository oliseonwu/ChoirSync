const { pointer } = require("../utils/helpers");

// ROUTE FUNCTIONS

/**
 * Stores a push token for a user
 * @param {object} request - The request object
 * @returns {Promise<object>} The result object containing:
 *   - success: boolean
 *   - message: string
 */
async function storePushToken(request) {
  const { token } = request.params;
  const requestUserObject = request.user; // Get the user who called the function
  const userId = requestUserObject.id;
  let result;

  try {
    result = await savePushToken(userId, token);
    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error storing push token:", error);
    return {
      success: false,
      message: `Cloud error: Failed to store push token`,
    };
  }
  return result;
}

/**
 * Deletes a push token for a user
 * @param {string} userId - The user id
 * @param {string} installationId - The installation id
 * @returns {Promise<object>} The result object containing:
 *   - success: boolean
 *   - message: string
 */
async function deletePushToken(request) {
  const userId = request.user.id;
  const token = request.params.token;
  try {
    const pushTokenObject = await fetchPushTokenObject(userId, token);
    await pushTokenObject.destroy();
    return { success: true, message: "Token deleted successfully" };
  } catch (error) {
    console.error("Error deleting push token: ", error);
    return {
      success: false,
      message: "Cloud error: Failed to delete token.",
    };
  }
}
// FUNCTIONS

/**
 * Fetches a push token for a user
 * @param {string} userId - The user id
 * @param {string} token - The push token
 * @returns {Promise<object>} The result object containing:
 *   - The push token object
 *   - null if the push token does not exist
 */
async function fetchPushTokenObject(userId, token) {
  try {
    const query = new Parse.Query("PushTokens");
    query.equalTo("push_token", token);
    query.equalTo("user", pointer(userId, "_User"));

    const tokenObject = await query.first({ useMasterKey: true });
    return tokenObject ? tokenObject : null;
  } catch (error) {
    console.error("Error fetching push token:", error);
    return null;
  }
}
const fetchPushTokenObjects = async (tokenList) => {
  const query = new Parse.Query("PushTokens");
  query.containedIn("push_token", tokenList);
  const tokenObjects = await query.find({ useMasterKey: true });
  return tokenObjects;
};

/**
 * Saves a push token for a user
 * @param {string} userId - The user id
 * @param {string} pushToken - The push token
 * @returns {Promise<object>} The result object containing:
 *   - success: boolean
 *   - message: string
 */
async function savePushToken(userId, pushToken) {
  try {
    const existingTokenObject = await fetchPushTokenObject(userId, pushToken);
    let tokenObject;

    if (existingTokenObject) {
      return { success: true, message: "Token already exists" };
    }

    tokenObject = new Parse.Object("PushTokens");
    tokenObject.set("user", pointer(userId, "_User"));
    tokenObject.set("push_token", pushToken);
    await tokenObject.save(null, { useMasterKey: true });

    return { success: true, message: "Token saved successfully" };
  } catch (error) {
    console.error("Error saving push token:", error);
    return { success: false, message: "Failed to save token: " + error };
  }
}

/**
 * Deletes multiple push tokens
 * @param {Array<string>} tokenList - The list of push tokens to delete (not push token objects)
 * @returns {Promise<object>} The result object containing:
 *   - success: boolean
 */
async function deletePushTokens(tokenList) {
  try {
    const pushTokenObjects = await fetchPushTokenObjects(tokenList);
    await Parse.Object.destroyAll(pushTokenObjects, { useMasterKey: true });
    return { success: true, message: "Tokens deleted successfully" };
  } catch (error) {
    console.error("Error deleting push tokens: ", error);
    return { success: false, message: "Failed to delete tokens: " + error };
  }
}

/**
 * Gets the push tokensObjects for an array of user IDs
 * @param {Array<string>} userIds - Array of user IDs
 * @returns {Promise<Object>} Object mapping user IDs to their push tokens
 */
async function getUsersPushTokenObjects(userIds) {
  try {
    const PushTokens = Parse.Object.extend("PushTokens");
    const query = new Parse.Query(PushTokens);

    query.containedIn(
      "user",
      userIds.map((id) => pointer(id, "_User"))
    );
    query.include("user");

    const tokenObjects = await query.find({ useMasterKey: true });

    return tokenObjects;
  } catch (error) {
    throw new Error(`Failed to get push tokens: ${error.message}`);
  }
}

module.exports = {
  storePushToken,
  fetchPushTokenObject,
  savePushToken,
  deletePushTokens,
  fetchPushTokenObjects,
  getUsersPushTokenObjects,
  deletePushToken,
};
