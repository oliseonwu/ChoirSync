/**
 * Invite code related cloud functions
 *
 * Purpose:
 * - Generate and manage invite codes
 * - Validate invite codes
 * - Handle invite code expiration
 * - Any functionality related to group invitations
 *
 * Note: Each function should handle a specific invite-related operation
 */

const { pointer } = require("../utils/helpers");
const {
  INVITE_CODE_EXPIRY,
  MIN_REMAINING_TIME,
} = require("../config/constants");

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function regenerateInviteCode(request) {
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
}

async function validateInviteCode(request) {
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

    const updatedAt = inviteCode.updatedAt;
    const currentTime = new Date();
    const timeDiff = currentTime - updatedAt;

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
}

async function fetchInviteCode(request) {
  const { groupId } = request.params;

  if (!groupId) {
    throw new Error("Group ID is required");
  }

  const query = new Parse.Query("InviteCode");
  query.equalTo("choir_groups_id", pointer(groupId));

  try {
    const inviteCode = await query.first({ useMasterKey: true });

    if (!inviteCode) {
      return Parse.Cloud.run("regenerateInviteCode", { groupId });
    }

    const currentTime = new Date();
    const createdAt = inviteCode.createdAt;
    const timeDiff = currentTime - createdAt;
    const timeRemaining = INVITE_CODE_EXPIRY - timeDiff;

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
}

module.exports = {
  regenerateInviteCode,
  validateInviteCode,
  fetchInviteCode,
};
