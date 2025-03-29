const { pointer } = require("../utils/helpers");
const { sendGroupNotification } = require("./notifications");

// ROUTES

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
 * @param {number} request.params.page Page number for pagination(starts at page 1)
 * @param {number} request.params.limit Number of recordings to fetch per page
 * @param {boolean} request.params.returnInClientFormat Whether to return the recordings in the format the client expects
 * @returns {Object} Object containing:
 *   - success: boolean - Whether the recordings were fetched successfully
 *   - message: string - A message describing the result of the operation
 *   - count: number - The number of recordings fetched
 *   - recordings: Object[] - An array of objects containing recording details
 */
async function fetchRecordings(request) {
  const {
    groupId,
    page = 1,
    limit = 20,
    returnInClientFormat = true,
  } = request.params;

  const skip = (page - 1) * limit;
  const Recordings = Parse.Object.extend("Recordings");
  const query = new Parse.Query(Recordings);
  let recordings;

  try {
    query.equalTo("choir_group_id", pointer(groupId, "ChoirGroups"));
    query.descending("rehearsal_date");
    query.skip(skip);
    query.limit(limit);

    recordings = await query.find({ useMasterKey: true });

    if (returnInClientFormat) {
      recordings = toClientFormat(recordings, page);
    }

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

// FUNCTIONS

/**
 * Converts an array of DB recording objects to the format the client expects
 * @param {Parse.Object[]} recordings Recording objects
 * @param {number} page Page number for the paginated recordings. Defaults to 1. Used while determining if a recording is the first rehearsal recording
 * @returns {Object[]} Array of objects containing:
 *   - id: string - The recording's objectId
 *   - name: string - The recording's name
 *   - singerName: string - The recording's singer name
 *   - channel: string - The recording's channel
 *   - link: string - The recording's link
 *   - file: Parse.File - The recording's file
 *   - isMultiTracked: boolean - Whether the recording is multi-tracked
 *   - rehearsalDate: Date - The recording's rehearsal date
 *   - categoryId: string - The recording's category id
 *   - choirGroupId: string - The recording's choir group id
 *   - isFirstRehearsalRecording: boolean - Whether the recording is the first rehearsal recording for the rehearsal date
 */
function toClientFormat(recordings, page = 1) {
  let isFirstRehearsalRecording;
  let currentIndex;

  return recordings.map((recording, index) => {
    if (
      index === 0 ||
      recording.get("rehearsal_date").toDateString() !==
        recordings[index - 1].get("rehearsal_date").toDateString()
    ) {
      isFirstRehearsalRecording = true;
      currentIndex = 1;
    } else {
      isFirstRehearsalRecording = false;
      currentIndex++;
    }

    return {
      id: recording.id,
      index: currentIndex,
      name: recording.get("name"),
      singerName: recording.get("singer_name"),
      channel: recording.get("channel"),
      link: recording.get("link"),
      file: recording.get("File"),
      isMultiTracked: recording.get("is_multi_tracked"),
      rehearsalDate: recording.get("rehearsal_date"),
      categoryId: recording.get("category_id").id,
      choirGroupId: recording.get("choir_group_id").id,
      isFirstRehearsalRecording: isFirstRehearsalRecording,
    };
  });
}

module.exports = {
  uploadRecordings,
  fetchRecordings,
};
