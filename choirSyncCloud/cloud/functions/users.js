const { deleteUserMemberRecords } = require("./groups");
const { deleteUserPushTokens } = require("./token");
// ROUTES

/**
 * Deletes the currently logged in user
 * @returns {Promise<Object>} Result of deletion
 */
const deleteCurrentUser = async (request) => {
  if (!request.user) {
    throw new Error("Must be logged in to delete account");
  }

  try {
    await request.user.destroy({ useMasterKey: true });
    return {
      success: true,
      message: "User account deleted successfully",
    };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

// FUNCTIONS

const updateUserField = async (userId, field, value) => {
  try {
    // Get user

    if (!userId || !field) {
      throw new Error("User ID and field parameters are required");
    }

    const user = await getUser(userId);

    // Update the specified field
    user.set(field, value);
    await user.save(null, { useMasterKey: true });

    return {
      success: true,
      message: `User ${user.get("username")} updated successfully`,
      updatedField: field,
    };
  } catch (error) {
    throw new Error(`Failed to update user field: ${error.message}`);
  }
};

// Example usage with field validation
const updateUserFields = async (userId, updates) => {
  try {
    // Get user
    const user = await getUser(userId);

    // Update all provided fields
    Object.entries(updates).forEach(([field, value]) => {
      user.set(field, value);
    });

    await user.save(null, { useMasterKey: true });

    return {
      success: true,
      message: `User ${user.get("username")} updated successfully`,
      updatedFields: updates,
    };
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

const getUser = async (userId) => {
  try {
    const user = await new Parse.Query(Parse.User).get(userId, {
      useMasterKey: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};
/**
 * Fetches multiple users by their IDs
 * @param {string[]} userIds - Array of user IDs to fetch
 * @returns {Promise<Parse.User[]>} Array of Parse User objects
 */
async function fetchUsersByIds(userIds) {
  try {
    const query = new Parse.Query(Parse.User);
    query.containedIn("objectId", userIds);

    const users = await query.find({ useMasterKey: true });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Updates multiple users with the same field values
 * @param {string[]} userIds - Array of user IDs to update
 * @param {Object} fieldsAndValuesObject - Object containing fields and values to update
 * @returns {Promise<Object>} Result of the batch update
 */
async function updateMultipleUsers(userIds, fieldsAndValuesObject) {
  try {
    const users = await fetchUsersByIds(userIds);

    // Update all users with the same field values
    const userUpdates = users.map((user) => {
      Object.entries(fieldsAndValuesObject).forEach(([key, value]) => {
        user.set(key, value);
      });
      return user;
    });

    // Execute batch update with master key
    await Parse.Object.saveAll(userUpdates, { useMasterKey: true });

    return {
      success: true,
      message: `Successfully updated ${userUpdates.length} users`,
    };
  } catch (error) {
    console.error("Error updating users:", error);
    throw error;
  }
}

const getUserByExpoPushToken = async (expoPushToken) => {
  const user = await new Parse.Query(Parse.User).get(expoPushToken, {
    useMasterKey: true,
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

//TRIGGER FUNCTIONS
/**
 * Trigger to clean up user data before deletion
 * Automatically removes associated choir member records
 */
Parse.Cloud.afterDelete(Parse.User, async (request) => {
  const user = request.object;

  try {
    await deleteUserMemberRecords(user);
    await deleteUserPushTokens(user);
    await deleteUserSessions(user);
  } catch (error) {
    throw new Error(`Failed to delete user member records: ${error.message}`);
  }
});

/**
 * Deletes all session data for a specific user
 * @param {Parse.User} user - The user whose sessions should be deleted
 * @returns {Promise<Object>} Result of the operation
 */
async function deleteUserSessions(user) {
  try {
    const query = new Parse.Query(Parse.Session);
    query.equalTo("user", user.toPointer());

    const sessions = await query.find({ useMasterKey: true });
    if (sessions.length > 0) {
      await Parse.Object.destroyAll(sessions, { useMasterKey: true });
    }

    return {
      success: true,
      message: `Deleted ${sessions.length} sessions`,
    };
  } catch (error) {
    throw new Error(`Failed to delete user sessions: ${error.message}`);
  }
}

module.exports = {
  updateUserField,
  updateUserFields,
  getUser,
  getUserByExpoPushToken,
  fetchUsersByIds,
  updateMultipleUsers,
  deleteCurrentUser,
};
