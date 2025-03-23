const { pointer } = require("../utils/helpers");
const { sendGroupNotification } = require("./notifications");
/**
 * Uploads YouTube recording references to the Recordings table
 * @param {Object} request Request object
 * @param {string} request.params.choirGroupId ID of the choir group
 * @param {Object} request.params.recordingData Object containing recording entries
 * @param {boolean} request.params.notify Whether to send a notification to the group
 * @param {string} request.params.rehearsalDate Date of the rehearsal
 * Example: {
 *   recording1: { name: string, url: string, singerName: string, rehearsalDate: string, categoryId: string },
 *   recording2: { name: string, url: string, singerName: string, rehearsalDate: string, categoryId: string }
 * }
 */
async function uploadRecordings(request) {
  const { choirGroupId, recordingData, notify, rehearsalDate } = request.params;

  const requestObject = {
    params: {
      groupId: choirGroupId,
      title: "New Recordings",
      message: "Check out the new recordings.",
    },
  };

  try {
    const Recordings = Parse.Object.extend("Recordings");
    const recordings = Object.values(recordingData).map((recording) => {
      const recordingObj = new Recordings();

      recordingObj.set({
        name: recording.name,
        singer_name: recording.singerName,
        choir_group_id: pointer(choirGroupId, "ChoirGroups"),
        channel: "YT",
        link: recording.url,
        rehearsal_date: new Date(rehearsalDate),
        category_id: pointer(recording.categoryId, "Category"),
        is_multi_tracked: false,
      });
      return recordingObj;
    });

    await Parse.Object.saveAll(recordings, { useMasterKey: true });

    if (notify) {
      // Send a notification to the group
      sendGroupNotification(requestObject);
    }

    return {
      success: typeof notify,
      message: `Successfully uploaded ${recordings.length} recording references`,
      count: recordings.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to upload recordings: ${error.message}`,
    };
  }
}

/**
 * Fetches recordings from the Recordings table
 * @param {Object} request Request object
 * @param {string} request.params.groupId ID of the choir group
 * @param {number} request.params.page Page number for pagination
 * @param {number} request.params.limit Number of recordings to fetch per page
 * @returns {Object} Object containing success status, message, count, and recordings
 */
async function fetchRecordings(request) {
  const { groupId, page, limit } = request.params;
  const LIMIT = limit || 20;
  const skip = (page - 1) * LIMIT;
  const Recordings = Parse.Object.extend("Recordings");
  const query = new Parse.Query(Recordings);

  try {
    query.equalTo("choir_group_id", pointer(groupId, "ChoirGroups"));
    query.skip(skip);
    query.limit(LIMIT);
    const recordings = await query.find({ useMasterKey: true });
    return {
      success: true,
      message: `Successfully fetched ${recordings.length} recordings`,
      count: recordings.length,
      recordings: recordings,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch recordings: ${error.message}`,
    };
  }
}

module.exports = {
  uploadRecordings,
  fetchRecordings,
};
