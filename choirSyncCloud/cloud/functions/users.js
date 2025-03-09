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
const getUserByExpoPushToken = async (expoPushToken) => {
  const user = await new Parse.Query(Parse.User).get(expoPushToken, {
    useMasterKey: true,
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  updateUserField,
  updateUserFields,
  getUser,
  getUserByExpoPushToken,
};
