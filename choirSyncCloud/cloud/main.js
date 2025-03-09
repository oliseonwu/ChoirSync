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
const { Expo } = require("expo-server-sdk");

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

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
  const tickets = [
    {
      status: "error",
      message:
        '"ExponentPushToken[lgKyTDKGdw0xMTA8LLwr_5]" is not a registered push notification recipient',
      details: {
        error: "DeviceNotRegistered",
        expoPushToken: "ExponentPushToken[lgKyTDKGdw0xMTA8LLwr_5]",
      },
    },
  ];

  let membersWithPushTokens = [];

  membersWithPushTokens = await groupFunctions.getAllMembersOfGroup(
    "2DDTYeG6X6"
  );

  // return membersWithPushTokens;

  membersWithPushTokens = membersWithPushTokens.filter((member) =>
    Expo.isExpoPushToken(member.get("user_id").get("expo_push_token"))
  );

  const result = await notificationFunctions.handlePushTicketsErrors(
    tickets,
    membersWithPushTokens
  );

  return result;
});

Parse.Cloud.define("test3", async (request) => {
  // const chunk = [["01956f5c-b1e9-78b6-a58e-aaf3485c56c9"], ];
  const chunk = ["01956f44-0dbf-70d3-ac2b-8f2305c8621a"];
  // const test = await notificationFunctions.testJsonPlaceholder();

  const result = await notificationFunctions.getPushNotificationReceiptsAsync(
    chunk
  );

  // const result = await notificationFunctions.testExpoReceipts();

  return result;
});

// "result": {
//     "username": "olisemeduaphilip@yahoo.com",
//     "email": "olisemeduaphilip@yahoo.com",
//     "firstName": "Olisemedua",
//     "lastName": "Onwuatogwu",
//     "createdAt": "2024-11-08T04:10:12.054Z",
//     "updatedAt": "2025-02-24T20:07:27.004Z",
//     "ACL": {
//         "3NMtgWnykU": {
//             "read": true,
//             "write": true
//         }
//     },
//     "objectId": "3NMtgWnykU",
//     "__type": "Object",
//     "className": "_User"
// }
