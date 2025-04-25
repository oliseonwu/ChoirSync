const { deleteUserMemberRecords } = require("./groups");
const { deleteUserPushTokens } = require("./token");
const { getUserByEmail } = require("../utils/helpers");
const { redeemOtpCode } = require("./code");
const {
  storeOtpCode,
  sendOtpEmail,
  getOtpCodeObjectForUser,
} = require("./code");
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

/**
 * Checks if a user with the specified email exists
 * @param {string} email - Email address to check
 * @returns {Promise<Object>} Object containing existence status and user (if found)
 */
async function checkUserExistsByEmail(request) {
  try {
    const { email } = request.params;
    const query = new Parse.Query(Parse.User);
    query.equalTo("email", email.toLowerCase());

    const user = await query.first({ useMasterKey: true });

    return {
      success: true,
      exists: !!user,
    };
  } catch (error) {
    console.error("Error checking user by email:", error);
    throw new Error(
      `Cloud error. Failed to check user existence: ${error.message}`
    );
  }
}

/**
 * Initiates password reset process for a user
 * Generates and sends a 6-digit OTP code
 * @param {Object} request - Parse Cloud request object
 * @returns {Promise<Object>} Result of operation
 */
const forgotPassword = async (request) => {
  try {
    // Get current user
    const { email } = request.params;
    const user = await getUserByEmail(email);

    // Generate and store OTP code
    const { code } = await storeOtpCode(user);

    // Send OTP code via email
    await sendOtpEmail(email, code);

    return {
      success: true,
      message: "Password reset code sent to your email",
      email: email,
    };
  } catch (error) {
    console.error(`Password reset error: ${error.message}`);
    throw new Error(`Failed to initiate password reset: ${error.message}`);
  }
};

/**
 * Resets a user's password after verifying OTP code
 * @param {Object} request - Parse Cloud request object
 * @returns {Promise<Object>} Result of operation
 */
const resetPassword = async (request) => {
  const { email, newPassword } = request.params;

  try {
    // 1. Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error(`No user found with email: ${email}`);
    }

    // 2. Check if the OTP code has been redeemed and verified by user
    const otpObject = await getOtpCodeObjectForUser(user);

    if (!otpObject) {
      throw new Error("No OTP code found for this user");
    }

    const isCodeVerified = otpObject.get("verified_by_user") || false;
    const isCodeRedeemed = otpObject.get("redeemed_by_user") || false;

    if (isCodeRedeemed || !isCodeVerified) {
      throw new Error("OTP code has already been used or not verified");
    }

    // 3. Redeem the OTP code
    await redeemOtpCode(otpObject);

    // 4. Reset the password
    user.setPassword(newPassword);
    await user.save(null, { useMasterKey: true });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error(`Password reset error: ${error.message}`);
    throw new Error(`Failed to reset password: ${error.message}`);
  }
};

module.exports = {
  updateUserField,
  updateUserFields,
  getUser,
  getUserByExpoPushToken,
  fetchUsersByIds,
  updateMultipleUsers,
  deleteCurrentUser,
  checkUserExistsByEmail,
  forgotPassword,
  resetPassword,
};
