/**
 * Main entry point for Parse Cloud Code
 *
 * Purpose:
 * - Register all cloud functions, triggers, and jobs
 * - Import and organize all function modules
 * - No actual function implementations should be here
 * - Keep this file as clean and organized as possible
 */

const inviteFunctions = require("./functions/invites");
const groupFunctions = require("./functions/groups");
const notificationFunctions = require("./functions/notifications");
const userFunctions = require("./functions/users");
const tokenFunctions = require("./functions/token");
const recordingsFunctions = require("./functions/recordings");
const newSongsFunctions = require("./functions/newSongs");
const codeFunctions = require("./functions/code");
const helpers = require("./utils/helpers");
const { Expo } = require("expo-server-sdk");

// Register invite functions
Parse.Cloud.define(
  "regenerateInviteCode",
  inviteFunctions.regenerateInviteCode
);
Parse.Cloud.define("validateInviteCode", inviteFunctions.validateInviteCode);
Parse.Cloud.define("fetchInviteCode", inviteFunctions.fetchInviteCode);

// Register group functions
Parse.Cloud.define("addUserToChoirGroup", groupFunctions.addUserToChoirGroup);

// Register notification functions

//{ "groupId":"2DDTYeG6X6", "title":"New Recordings", "message": "Check it out!" }
Parse.Cloud.define(
  "sendGroupNotification",
  notificationFunctions.sendGroupNotification,
  {
    fields: {
      groupId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      data: {
        type: Object,
        required: false,
      },
    },
  }
);

Parse.Cloud.define(
  "testNotifySingleUser",
  notificationFunctions.testNotifySingleUser,
  {
    requireUser: true,
  }
);

// Register token functions
Parse.Cloud.define("storePushToken", tokenFunctions.storePushToken, {
  fields: {
    token: {
      type: String,
      required: true,
      options: (val) => Expo.isExpoPushToken(val),
      error: "Cloud function error: Invalid Expo push token",
    },
  },
  requireUser: true,
});
Parse.Cloud.define("deletePushToken", tokenFunctions.deletePushToken, {
  fields: {
    token: {
      type: String,
      required: true,
      options: (val) => Expo.isExpoPushToken(val),
      error: "Cloud function error: Invalid Expo push token",
    },
  },
  requireUser: true,
});

// Register user functions
Parse.Cloud.define("deleteCurrentUser", userFunctions.deleteCurrentUser, {
  requireUser: true,
});

Parse.Cloud.define(
  "checkUserExistsByEmail",
  userFunctions.checkUserExistsByEmail,
  {
    fields: {
      email: {
        type: String,
        required: true,
        options: (val) => helpers.isEmailValid(val),
        error: "Cloud function error: Invalid email",
      },
    },
  }
);

Parse.Cloud.define("resetPassword", userFunctions.resetPassword, {
  fields: {
    email: {
      type: String,
      required: true,
      options: (val) => helpers.isEmailValid(val),
      error: "Cloud function error: Invalid email",
    },
    newPassword: {
      type: String,
      required: true,
    },
  },
});

// Register forgotPassword function
Parse.Cloud.define("forgotPassword", userFunctions.forgotPassword, {
  fields: {
    email: {
      type: String,
      required: true,
      options: (val) => helpers.isEmailValid(val),
      error: "Cloud function error: Invalid email",
    },
  },
});

// Register OTP verification functions
Parse.Cloud.define("verifyOtpCode", codeFunctions.verifyOtpCode, {
  fields: {
    code: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      options: (val) => helpers.isEmailValid(val),
      error: "Cloud function error: Invalid email",
    },
  },
});

// Register recording functions
Parse.Cloud.define("uploadRecordings", recordingsFunctions.uploadRecordings, {
  fields: {
    choirGroupId: {
      type: String,
      required: true,
    },
    rehearsalDate: {
      type: String,
      required: true,
    },
    recordingData: {
      type: Object,
      required: true,
      options: (val) =>
        Object.values(val).every(
          (item) =>
            typeof item.name === "string" &&
            typeof item.url === "string" &&
            typeof item.singerName === "string" &&
            typeof item.rehearsalDate === "string" &&
            typeof item.categoryId === "string"
        ),
      error: "Cloud function error: Invalid recording data",
    },
    notify: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  requireMaster: true,
});

Parse.Cloud.define(
  "fetchRecordings",
  async (request) => {
    const recordings = await recordingsFunctions.fetchRecordings(request);
    return recordings;
  },
  {
    fields: {
      groupId: { type: String, required: true },
      page: {
        type: Number,
        required: false,
        options: (val) => val > 0,
      },
      limit: {
        type: Number,
        required: false,
        options: (val) => val > 0,
      },
      returnInClientFormat: {
        type: Boolean,
        required: false,
      },
    },
    requireUser: true,
  }
);

// Register new songs functions
Parse.Cloud.define("uploadNewSongs", newSongsFunctions.uploadNewSongs, {
  fields: {
    groupId: { type: String, required: true },
    newSongsData: {
      type: Object,
      required: true,
      options: (val) => {
        return Object.values(val).every(
          (item) =>
            typeof item.name === "string" &&
            typeof item.singerName === "string" &&
            typeof item.focusThisWeek === "boolean" &&
            typeof item.url === "string"
        );
      },
    },
    notify: { type: Boolean, required: false, default: true },
  },
  requireMaster: true,
});

Parse.Cloud.define("fetchNewSongs", newSongsFunctions.fetchNewSongs, {
  fields: {
    groupId: { type: String, required: true },
    page: {
      type: Number,
      required: false,
      options: (val) => val > 0,
    },
    limit: {
      type: Number,
      required: false,
      options: (val) => val > 0,
    },
    returnInClientFormat: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  requireUser: true,
});

Parse.Cloud.define("test", async (request) => {
  // const { userId, installationId, pushToken } = request.params;
  const recordings = await recordingsFunctions.fetchRecordings(request);
  return recordings;
});

Parse.Cloud.define("test2", async (request) => {
  return "Still Running";
});

Parse.Cloud.define("test3", async (request) => {});

Parse.Cloud.define(
  "testNotifySingleUser",
  notificationFunctions.testNotifySingleUser,
  {
    requireUser: true,
  }
);
