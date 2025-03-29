const { pointer } = require("../utils/helpers");
const { sendGroupNotification } = require("./notifications");

/**
 * Represents the different types of new songs to display in the New Songs screen
 * @property {string} FOCUSED - Shows only focused songs for the week
 * @property {string} ALL - Shows all songs regardless of focus status
 */
const NewSongsType = {
  FOCUSED: "FOCUSED",
  ALL: "ALL",
};

/**
 * Uploads new songs to the NewSongs table
 * @param {Object} request Request object
 * @param {string} request.params.groupId ID of the choir group
 * @param {Object} request.params.newSongsData Object containing new song entries
 * @param {boolean} request.params.notify Whether to send a notification to the group
 *
 * Example: {
 *   groupId: string,
 *   notify: boolean,
 *   newSongsData: {
 *     newSong1: { name: string, singerName: string, focusThisWeek: boolean, url: string },
 *     newSong2: { name: string, singerName: string, focusThisWeek: boolean, url: string }
 *   }
 * }
 */
async function uploadNewSongs(request) {
  const { groupId, newSongsData, notify } = request.params;
  // This is used to check if there is a song that is set to be focused this week
  let focusedSongDetected = false;

  let notificationRequestObject;
  let songString = "Song";

  try {
    const NewSongs = Parse.Object.extend("NewSongs");
    const songs = Object.values(newSongsData).map((song) => {
      const songObj = new NewSongs();

      songObj.set({
        song_name: song.name,
        artist_name: song.singerName,
        this_week_focus: song.focusThisWeek,
        link: song.url,
        group: pointer(groupId, "ChoirGroups"),
      });

      if (song.focusThisWeek) {
        focusedSongDetected = true;
      }
      return songObj;
    });

    await Parse.Object.saveAll(songs, { useMasterKey: true });

    songString = songs.length > 1 ? "Songs" : "Song";

    if (focusedSongDetected) {
      notificationRequestObject = {
        params: {
          groupId: groupId,
          title: `New ${songString} For the Week!`,
          message: `Check out new ${songString} for next rehearsal!`,
          data: {
            pathname: "/newSongs",
            params: {
              newSongsType: NewSongsType.FOCUSED,
            },
          },
        },
      };

      // Send a notification to the group
      sendGroupNotification(notificationRequestObject);
    }

    return {
      success: true,
      message: `Successfully uploaded ${songs.length} new ${songString}`,
      count: songs.length,
      notificationObject: notificationRequestObject,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to upload new songs: ${error.message}`,
    };
  }
}

/**
 * Fetches songs from the NewSongs table
 * @param {Object} request Request object
 * @param {string} request.params.groupId ID of the choir group
 * @param {number} request.params.page Page number for pagination(starts at page 1)
 * @param {number} request.params.limit Number of songs to fetch per page
 * @returns {Object} Object containing:
 *   - success: boolean - Whether the songs were fetched successfully
 *   - message: string - A message describing the result of the operation
 *   - count: number - The number of songs fetched
 *   - songs: Object[] - An array of NewSongs objects containing:
 *     - song_name: string
 *     - artist_name: string
 *     - this_week_focus: boolean
 *     - group: Pointer
 *     - link: string
 */
async function fetchNewSongs(request) {
  const {
    groupId,
    page = 1,
    limit = 20,
    returnInClientFormat = true,
  } = request.params;

  const skip = (page - 1) * limit;
  const NewSongs = Parse.Object.extend("NewSongs");
  const query = new Parse.Query(NewSongs);
  let songs;
  let numberOfSongs = 0;
  let songString = "song";

  try {
    query.equalTo("group", pointer(groupId, "ChoirGroups"));
    query.descending("createdAt");
    query.descending("this_week_focus");
    query.skip(skip);
    query.limit(limit);

    songs = await query.find({ useMasterKey: true });
    numberOfSongs = songs.length;
    songString = numberOfSongs > 1 ? "songs" : "song";
    if (returnInClientFormat) {
      songs = toClientFormat(songs, page);
    }

    return {
      success: true,
      message: `Successfully fetched ${numberOfSongs} new ${songString}`,
      count: numberOfSongs,
      returnedSongs: songs,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch songs: ${error.message}`,
      limit: limit,
      page: page,
    };
  }
}

function toClientFormat(songs) {
  let focusedSongDetected = false;
  let focusedSongs = [];
  let unFocusedSongs = [];
  let currentSong = null;
  let songsInClientFormat = null;

  for (let song of songs) {
    currentSong = {
      id: song.id,
      name: song.get("song_name"),
      singerName: song.get("artist_name"),
      focusThisWeek: song.get("this_week_focus"),
      link: song.get("link"),
    };
    if (song.get("this_week_focus")) {
      focusedSongDetected = true;
      focusedSongs.push(currentSong);
    } else {
      unFocusedSongs.push(currentSong);
    }
  }

  songsInClientFormat = {
    focusedSongDetected: focusedSongDetected,
    unFocusedSongs: unFocusedSongs,
    focusedSongs: focusedSongs,
  };

  return songsInClientFormat;
}

module.exports = {
  uploadNewSongs,
  fetchNewSongs,
};
