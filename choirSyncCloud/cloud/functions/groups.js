/**
 * Choir Group related cloud functions
 *
 * Purpose:
 * - Group management operations
 * - Member management within groups
 * - Group permissions and roles
 * - Any functionality related to choir groups
 *
 * Note: Each function should handle a specific group-related operation
 */

const { pointer } = require("../utils/helpers");

async function addUserToChoirGroup(request) {
  const { groupId, userId } = request.params;

  if (!groupId || !userId) {
    throw new Error("Group ID and User ID are required");
  }

  try {
    const ChoirMembers = Parse.Object.extend("ChoirMembers");
    const choirMember = new ChoirMembers();

    choirMember.set("user_id", pointer(userId, "_User"));
    choirMember.set("choir_groups_id", pointer(groupId));
    choirMember.set("role", "member");

    await choirMember.save(null, { useMasterKey: true });

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Failed to add user to choir group: ${error.message}`);
  }
}
async function getAllMembersOfGroup(groupId) {
  try {
    const ChoirMembers = Parse.Object.extend("ChoirMembers");
    const query = new Parse.Query(ChoirMembers);
    query.equalTo("choir_groups_id", pointer(groupId));
    query.include("user_id");

    const members = await query.find({ useMasterKey: true });

    return members;
  } catch (error) {
    throw new Error(`Failed to get all members of group: ${error.message}`);
  }
}

module.exports = {
  addUserToChoirGroup,
  getAllMembersOfGroup,
};
