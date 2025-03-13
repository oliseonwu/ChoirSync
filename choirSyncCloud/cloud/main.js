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
    },
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

Parse.Cloud.define("test", async (request) => {
  const { userId, installationId, pushToken } = request.params;
  const result = await tokenFunctions.savePushToken(
    userId,
    installationId,
    pushToken
  );

  return result;
});

Parse.Cloud.define("test2", async (request) => {
  const pushTokens =
    await groupFunctions.getGroupMembersPushTokens("2DDTYeG6X6");

  return pushTokens;
});

Parse.Cloud.define("test3", async (request) => {});
