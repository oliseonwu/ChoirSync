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
Parse.Cloud.define("storePushToken", notificationFunctions.storePushToken, {
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
Parse.Cloud.define(
  "sendGroupNotification",
  notificationFunctions.sendGroupNotification
);

Parse.Cloud.define("checkTicketId", notificationFunctions.checkTicketId);

Parse.Cloud.define("test", (request) => {
  return "yess";
});

Parse.Cloud.define("test2", async (request) => {
  const result = await userFunctions.updateMultipleUsers(
    ["3NMtgWnykU", "nuB55AfEYH"],
    {
      expo_push_token: "test token",
    }
  );

  return result;
});

Parse.Cloud.define("test3", async (request) => {});
