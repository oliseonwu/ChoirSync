const INVITE_CODE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MIN_REMAINING_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function pointer(id, className = "ChoirGroups") {
  return {
    __type: "Pointer",
    className,
    objectId: id,
  };
}

Parse.Cloud.define("regenerateInviteCode", async (request) => {
  const { groupId } = request.params;

  if (!groupId) {
    throw new Error("Group ID is required");
  }

  const groupPointer = pointer(groupId);
  const query = new Parse.Query("InviteCode");
  query.equalTo("choir_groups_id", groupPointer);

  try {
    const code = generateInviteCode();
    const currentTime = new Date();
    let inviteCode = await query.first({ useMasterKey: true });

    if (inviteCode) {
      inviteCode.set("code", code);
      inviteCode.set("createdAt", currentTime);
    } else {
      const InviteCode = Parse.Object.extend("InviteCode");
      inviteCode = new InviteCode();
      inviteCode.set("choir_groups_id", groupPointer);
      inviteCode.set("code", code);
    }

    await inviteCode.save(null, { useMasterKey: true });

    return {
      success: true,
      code: code,
      expiresAt: new Date(currentTime.getTime() + INVITE_CODE_EXPIRY),
    };
  } catch (error) {
    throw new Error(`Failed to regenerate invite code: ${error.message}`);
  }
});

Parse.Cloud.define("validateInviteCode", async (request) => {
  const { code, groupId } = request.params;

  if (!code || !groupId) {
    throw new Error("Code and Group ID are required");
  }

  const query = new Parse.Query("InviteCode");
  query.equalTo("choir_groups_id", pointer(groupId));
  query.equalTo("code", code.toUpperCase());

  try {
    const inviteCode = await query.first({ useMasterKey: true });

    if (!inviteCode) {
      return {
        success: false,
        error: "Invalid invite code",
      };
    }

    const createdAt = inviteCode.createdAt;
    const currentTime = new Date();
    const timeDiff = currentTime - createdAt;

    if (timeDiff > INVITE_CODE_EXPIRY) {
      return {
        success: false,
        error: "Invite code has expired",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Failed to validate invite code: ${error.message}`);
  }
});

Parse.Cloud.define("fetchInviteCode", async (request) => {
  const { groupId } = request.params;

  if (!groupId) {
    throw new Error("Group ID is required");
  }

  const query = new Parse.Query("InviteCode");
  query.equalTo("choir_groups_id", pointer(groupId));

  try {
    const inviteCode = await query.first({ useMasterKey: true });

    if (!inviteCode) {
      // No code exists, generate new one
      return Parse.Cloud.run("regenerateInviteCode", { groupId });
    }

    const currentTime = new Date();
    const createdAt = inviteCode.createdAt;
    const timeDiff = currentTime - createdAt;
    const timeRemaining = INVITE_CODE_EXPIRY - timeDiff;

    // Generate new code if expired or less than 1 hour remaining
    if (timeDiff > INVITE_CODE_EXPIRY || timeRemaining < MIN_REMAINING_TIME) {
      return Parse.Cloud.run("regenerateInviteCode", { groupId });
    }

    return {
      success: true,
      code: inviteCode.get("code"),
      expiresAt: new Date(createdAt.getTime() + INVITE_CODE_EXPIRY),
    };
  } catch (error) {
    throw new Error(`Failed to fetch invite code: ${error.message}`);
  }
});

Parse.Cloud.define("addUserToChoirGroup", async (request) => {
  const { groupId, userId } = request.params;

  if (!groupId || !userId) {
    throw new Error("Group ID and User ID are required");
  }

  try {
    const ChoirMembers = Parse.Object.extend("ChoirMembers");
    const choirMember = new ChoirMembers();

    choirMember.set("user_id", pointer(userId, "_User"));
    choirMember.set("choir_groups_id", pointer(groupId));
    choirMember.set("role", "member"); // Default role for new members

    await choirMember.save(null, { useMasterKey: true });

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Failed to add user to choir group: ${error.message}`);
  }
});
