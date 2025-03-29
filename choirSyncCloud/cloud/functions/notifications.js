/**
 * Push Notification related cloud functions
 *
 * Purpose:
 * - Handle sending push notifications to users
 * - Manage notification tokens
 * - Group notification functions
 */

const { Expo } = require("expo-server-sdk");
const {
  getGroupMembersPushTokens,
  getIdsOfGroupsWithRecentRecordings,
} = require("./groups");
const { deletePushTokens, getUsersPushTokenObjects } = require("./token");
const { NotificationErrors } = require("../utils/notificationErrors");
const { sleep, isPacificTimeDay } = require("../utils/helpers");
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

// ROUTES

// Send notification to a choir group
/**
 * Send a notification to a group
 * @param {object} request - The request object
 * @param {string} request.params.groupId - The group ID
 * @param {string} request.params.title - The title of the notification
 * @param {string} request.params.message - The message of the notification
 * @returns {Promise<object>} A promise that resolves to an object containing:
 *   - SentTo: number - The number of users that received the notification
 *   - DidNotSendTo: number - The number of users that did not receive the notification
 *   - FailedTickets: number - The number of tickets that failed
 */
async function sendGroupNotification(request) {
  const { groupId, title, message, data = {} } = request.params;

  const tokenToUserMap = {};
  let tickets;
  let handlePushTicketsResult;
  let receipts;
  let handlePushReceiptResult;

  // We empty this variables later in the code.
  let membersPushTokens;

  if (!groupId || !title || !message) {
    throw new Error("Group ID, title, and message are required");
  }

  try {
    // Get push tokens of members.
    membersPushTokens = await getGroupMembersPushTokens(groupId);
    membersPushTokens = membersPushTokens.filter((pushTokenObject) => {
      const pushToken = pushTokenObject.get("push_token");
      return Expo.isExpoPushToken(pushToken);
    });

    // Create a map of push tokens to user IDs map
    membersPushTokens.forEach((pushTokenObject) => {
      const pushToken = pushTokenObject.get("push_token");
      tokenToUserMap[pushToken] = pushTokenObject.get("user").id;
    });

    // clear the membersWithPushTokens array
    membersPushTokens = undefined;

    // Send notifications
    tickets = await notificationSender(Object.keys(tokenToUserMap), {
      title,
      body: message,
      data,
    });

    // filter tickets
    let { ok: okTickets, error: errorTickets } =
      filterTicketsOrReceipts(tickets);

    handlePushTicketsResult = await handlePushTicketsandReceiptsErrors(
      errorTickets,
      "ticket"
    );

    // clear the errorTickets array
    errorTickets = undefined;

    // // get receipts Chunks

    await sleep(30000);
    receipts = await getReceiptsFromTickets(okTickets);

    let { ok: okReceipts, error: errorReceipts } =
      filterTicketsOrReceipts(receipts);

    handlePushReceiptResult = await handlePushTicketsandReceiptsErrors(
      errorReceipts,
      "receipt"
    );

    console.log({
      SentTo: okReceipts.length + " Users",
      DidNotSendTo:
        handlePushTicketsResult.failedCount +
        handlePushReceiptResult.failedCount +
        " Users",
      FailedTickets: handlePushTicketsResult.failedCount + "",
      ResolvedTickets: handlePushTicketsResult.resolvedCount + "",
      FailedReceipts: handlePushReceiptResult.failedCount + "",
      ResolvedReceipts: handlePushReceiptResult.resolvedCount + "",
    });

    return {
      SentTo: okReceipts.length + " Users",
      DidNotSendTo:
        handlePushTicketsResult.failedCount +
        handlePushReceiptResult.failedCount +
        " Users",
      FailedTickets: handlePushTicketsResult.failedCount + "",
      ResolvedTickets: handlePushTicketsResult.resolvedCount + "",
      FailedReceipts: handlePushReceiptResult.failedCount + "",
      ResolvedReceipts: handlePushReceiptResult.resolvedCount + "",
    };
  } catch (error) {
    throw new Error(`Failed to send group notification: ${error.message}`);
  }
}

/**
 * Send a test notification to the user who made the request
 * @param {object} request - The request object
 * @returns {Promise<object>} A promise that resolves to an object containing:
 *   - success: boolean - Whether the notification was sent successfully
 *   - message: string - The success or error message
 */
const testNotifySingleUser = async (request) => {
  const NewSongsType = {
    FOCUSED: "FOCUSED",
    ALL: "ALL",
  };

  try {
    const userId = request.user.id;
    let userExpoPushList = await getUsersPushTokenObjects([userId]);
    userExpoPushList = userExpoPushList.map((pushTokenObject) => {
      return pushTokenObject.get("push_token");
    });

    if (userExpoPushList.length === 0) {
      throw new Error("User has no push tokens");
    }

    const requestObject = {
      title: "Test Notification",
      body: "This is a test notification.",
      data: {
        pathname: "/newSongs",
        params: {
          pageTitle: "Members Picks",
          newSongsType: NewSongsType.ALL,
        },
      },
    };

    const tickets = await notificationSender(userExpoPushList, requestObject);

    return {
      success: true,
      message: "Sent Test Notification to current user",
      tickets,
    };
  } catch (error) {
    console.error("Failed to send test notification to current user: ", error);
    return {
      success: false,
      message: "Failed to send test notification to current user",
    };
  }
};

// FUNCTIONS

/**
 * Sends a notification to a list of tokens
 * @param {Array<string>} tokens - The tokens to send the notification to
 * @param {object} message - The message to send
 * @returns {Promise<Array<object>>} A list of tickets
 */
async function notificationSender(tokens, message) {
  // Create the messages array
  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title: message.title,
    body: message.body,
    data: message.data,
  }));

  // Chunk the messages to avoid rate limiting
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  // Send the chunks
  for (let chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      // if there was an error with a chunk of requests,
      // expo will return an array of errors.
      // We can keep of the chucks that failed and retry to send them.
      logErrorList(error, "Error sending notification chunk");
    }
  }

  return tickets;
}

/**
 * Filters tickets or receipts
 * @param {Array<object>} ticketsOrReceipts - List of tickets or receipts to filter
 * @returns {object} The result object containing:
 *   - ok: Array<object> - List of tickets or receipts with status "ok"
 *   - error: Array<object> - List of tickets or receipts with status "error"
 */
function filterTicketsOrReceipts(ticketsOrReceipts) {
  let ok = [];
  let error = [];

  for (let ticketOrReceipt of ticketsOrReceipts) {
    if (ticketOrReceipt.status === "ok") {
      ok.push(ticketOrReceipt);
    } else {
      error.push(ticketOrReceipt);
    }
  }

  return { ok, error };
}

/**
 * Handles push ticket errors and receipts errors
 * @param {Array<object>} errorList - List of tickets or receipts to handle
 * @param {string} type - The type of error to handle. Either "ticket" or "receipt"
 * @returns {Promise<object>} The result object containing:
 *   - failedCount: number
 *   - resolvedCount: number
 *
 */
async function handlePushTicketsandReceiptsErrors(errorList, type) {
  const result = {
    failedCount: 0,
    resolvedCount: 0,
  };
  let currentToken;
  const tokenList = [];
  let didResetPushTokens = false;

  errorList.forEach((ticket) => {
    result.failedCount++;

    switch (ticket.details?.error) {
      case NotificationErrors.DeviceNotRegistered:
        // ticket will always contain the push token if we get a DeviceNotRegistered error.
        currentToken = ticket.details.expoPushToken;

        if (currentToken) {
          tokenList.push(currentToken);
        }
        break;
      default:
        logError(
          `Failed to resolve a push ${type} error`,
          ticket.details.error,
          ticket.message
        );
    }
  });

  didResetPushTokens = await deletePushTokens(tokenList);

  if (didResetPushTokens) {
    result.resolvedCount = tokenList.length;
  }

  return result;
}

/**
 * Gets receipts for the passed in tickets
 * @param {Array<object>} tickets - The tickets to get receipts from
 * @returns {Promise<Array<object>>} The receipts
 */
async function getReceiptsFromTickets(tickets) {
  let receiptIdChunks;
  let receiptIds = [];
  let receipts = [];
  let receiptChunk;

  receiptIds = tickets.map((ticket) => ticket.id);
  receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (let chunk of receiptIdChunks) {
    try {
      receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);

      // we use for...in to iterate over the receiptChunk object
      // because the receiptChunk is an object containing multiple
      // receipts.
      for (let receiptId in receiptChunk) {
        receipts.push(receiptChunk[receiptId]);
      }
    } catch (error) {
      // if there is an error with a chunk of requests,
      // expo will return an array of errors.
      // We can keep of the chucks that failed and retry to send them.
      logErrorList(error, "Error getting receipts from tickets");
    }
  }

  return receipts;
}

/**
 * Log an error
 * @param {string} errorHeader - The header of the error
 * @param {string} errorCode - The code of the error
 * @param {string} errorMessage - The message of the error
 */
function logError(errorHeader, errorCode, errorMessage) {
  console.error(`${errorHeader} (errorcode = ${errorCode}) :  ${errorMessage}`);
}

/**
 * Log a list of errors. It also handles the case where the error is not array.
 * @param {Array<object> | object} error - The error object or array of error objects
 * @param {string} errorHeading - The heading of the error
 */
function logErrorList(error, errorHeading) {
  const errorList = Array.isArray(error)
    ? error
    : [
        {
          code: error.code || "No Error Code",
          message: error.message || error,
        },
      ];

  for (let err of errorList) {
    logError(errorHeading, err.code, err.message);
  }
}

// Cloud jobs

/**
 * Cloud job to notify group members about recent recordings
 * Runs every Thursday and Friday at 5:00 PM
 */
Parse.Cloud.job("notifyRecentRecordings", async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setUTCHours(0, 0, 0, 0);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Check for Thursday (4) or Friday (5) in Pacific Time
  if (!isPacificTimeDay([4, 5])) {
    console.log(
      "notifyRecentRecordings Job completed: Not the right day to run this job (Pacific Time)"
    );
    return {
      success: true,
      message: "Not the right day to run this job",
    };
  }

  try {
    const uniqueGroups = await getIdsOfGroupsWithRecentRecordings(oneWeekAgo);

    if (uniqueGroups.length === 0) {
      console.log(
        "notifyRecentRecordings Job completed: No groups with recent recordings"
      );
      return {
        success: true,
        message: "No groups with recent recordings",
      };
    }

    for (const groupId of uniqueGroups) {
      const requestObject = {
        params: {
          groupId,
          title: "Lets Practice!",
          message: "Check out the recent recordings.",
          data: {
            pathname: "/recordings",
            params: {},
          },
        },
      };
      sendGroupNotification(requestObject);
      await sleep(10000);
      // ... rest of notification logic
    }

    console.log("notifyRecentRecordings Job completed!");
    return {
      success: true,
      message: "notifyRecentRecordings Job completed!",
    };
  } catch (error) {
    console.error("notifyRecentRecordings Job failed:", error);
    return {
      success: false,
      message: "notifyRecentRecordings Job failed",
    };
  }
});

/**
 * Cloud job to notify group members about recent recordings
 * Runs every Thursday and Friday at 5:00 PM
 */
Parse.Cloud.job("testNotify", async () => {
  try {
    const requestObject = {
      params: {
        groupId: "2DDTYeG6X6",
        title: "Test Notification",
        message: "This is a test notification.",
        data: {},
      },
    };
    sendGroupNotification(requestObject);

    console.log("testNotify Job completed!");
    return {
      success: true,
      message: "testNotify Job completed!",
    };
  } catch (error) {
    console.error("testNotify Job failed:", error);
    return {
      success: false,
      message: "testNotify Job failed",
    };
  }
});

module.exports = {
  sendGroupNotification,
  handlePushTicketsandReceiptsErrors,
  notificationSender,
  testNotifySingleUser,
};

/*

Push Ticket Format:

 {
  "data": [
    {
      "status": "error" | "ok",
      "id": string, // this is the Receipt ID
      // if status === "error"
      "message": string,
      "details": JSON --> Eg: { "error": "DeviceNotRegistered" }
    },
    ...
  ],
  // only populated if there was an error with the entire request
  "errors": [{
    "code": string,
    "message": string
  }]
}

// Push Receipt Format:

{
  "data": {
    Receipt ID: {
      "status": "error" | "ok",
      // if status === "error"
      "message": string,
      "details": JSON --> Eg: { "error": "DeviceNotRegistered" }
    },
    ...
  },

  // only populated if there was an error with the entire request
  "errors": [{
    "code": string,
    "message": string
  }]
}

Push Ticket Error Codes (This a found in the details property):

1) DeviceNotRegistered


Push Receipt Error Codes (This a found in the details property):

1) DeviceNotRegistered
2) MessageTooBig: The total notification payload was too large. 
On Android and iOS, the total payload must be at most 4096 bytes.
3) MessageRateExceeded: You are sending messages too frequently 
to the given device. Implement exponential backoff and slowly
retry sending messages.
4) MismatchSenderId: This indicates that there is an issue with
your FCM push credentials. There are two pieces to FCM push 
credentials: your FCM server key, and your google-services.json 
file. Both must be associated with the same sender ID.
5) InvalidCredentials: Your push notification credentials
for your standalone app are invalid (for example, you may
have revoked them).







NOTE: 
1) in the recipt response, if  there is no push receipt for a 
requested receipt ID, it is not included in the response.

2) Even if a receipt's status says ok, this doesn't guarantee 
that the device has received the message; "ok" in a push receipt
means that the Android (FCM) or iOS (APNs) push notification service 
successfully received the notification.  If the recipient device
is turned off, for example, the iOS or Android push notification
service will try to deliver the message but the device won't 
necessarily receive it.

3) A status of ok in the push ticket response doesn't mean that the
device has received the message. it means that it got to the expo
push notification service.

4) Error Documentation. 
I did not write the debuging steps for the error codes. 
You can find them here:
https://docs.expo.dev/push-notifications/sending-notifications/#error-codes

5) You can learn more about apple credentials:
https://docs.expo.dev/app-signing/app-credentials/


*/

/*
{
    "result": {
        "result": {
            "status": "error",
            "updatedUsers": [],
            "updateCount": 0,
            "errors": [
                {}
            ]
        },
        "tickets": [
            {
                "status": "error",
                "message": "\"ExponentPushToken[lgKyTDKGdw0xMTA8LLwr_5]\" is not a registered push notification recipient",
                "details": {
                    "error": "DeviceNotRegistered",
                    "expoPushToken": "ExponentPushToken[lgKyTDKGdw0xMTA8LLwr_5]"
                }
            }
        ]
    }
}




*/
