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

// Register invite functions
Parse.Cloud.define(
  "regenerateInviteCode",
  inviteFunctions.regenerateInviteCode
);
Parse.Cloud.define("validateInviteCode", inviteFunctions.validateInviteCode);
Parse.Cloud.define("fetchInviteCode", inviteFunctions.fetchInviteCode);

// Register group functions
Parse.Cloud.define("addUserToChoirGroup", groupFunctions.addUserToChoirGroup);
