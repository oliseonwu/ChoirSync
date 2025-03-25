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
const { getUsersPushTokenObjects, deletePushTokens } = require("./token");

// ROUTES

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

// FUNCTIONS

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

/**
 * Deletes all records of a user being a member of one or more choir groups
 * @param {Parse.User} user - The user whose member records should be deleted
 * @returns {Promise<void>}
 */
async function deleteUserMemberRecords(user) {
  try {
    const ChoirMembers = Parse.Object.extend("ChoirMembers");
    const query = new Parse.Query(ChoirMembers);
    query.equalTo("user_id", user.toPointer());

    const memberRecords = await query.find({ useMasterKey: true });
    if (memberRecords.length > 0) {
      await Parse.Object.destroyAll(memberRecords, { useMasterKey: true });
    }
  } catch (error) {
    throw new Error(`Failed to delete user member records: ${error.message}`);
  }
}

/**
 * Gets all push tokens for all members of a group
 * @param {string} groupId - The ID of the group
 * @returns {Promise<Array<{
 * user: Pointer,
 * push_token: string,
 * }>>} Array of push tokens
 *
 */
async function getGroupMembersPushTokens(groupId) {
  try {
    const members = await getAllMembersOfGroup(groupId);
    const userIds = members.map((member) => member.get("user_id").id);

    // Get push tokenObjects for these users
    const pushTokensObjects = await getUsersPushTokenObjects(userIds);

    return pushTokensObjects;
  } catch (error) {
    throw new Error(`Failed to get members with push tokens: ${error.message}`);
  }
}

/**
 * Gets groups that have recordings within the specified time period
 * @param {Date} sinceDate - Get recordings since this date
 * @returns {Promise<string[]>} Array of group IDs that have recent recordings
 */
async function getIdsOfGroupsWithRecentRecordings(sinceDate) {
  try {
    const Recording = Parse.Object.extend("Recordings");
    const recordingQuery = new Parse.Query(Recording);
    recordingQuery.greaterThanOrEqualTo("rehearsal_date", sinceDate);
    recordingQuery.include("choir_group_id");

    const recentRecordings = await recordingQuery.find({ useMasterKey: true });

    // Get unique groups using Set and mapping
    const uniqueGroupIds = [
      ...new Set(
        recentRecordings.map((recording) => recording.get("choir_group_id").id)
      ),
    ];

    return uniqueGroupIds;
  } catch (error) {
    throw new Error(
      `Failed to get groups with recent recordings: ${error.message}`
    );
  }
}

module.exports = {
  addUserToChoirGroup,
  getAllMembersOfGroup,
  getGroupMembersPushTokens,
  getIdsOfGroupsWithRecentRecordings,
  deleteUserMemberRecords,
};
