/**
 * Push Notification related cloud functions
 *
 * Purpose:
 * - Handle sending push notifications to users
 * - Manage notification tokens
 * - Group notification functions
 */

const { Expo } = require("expo-server-sdk");
const { getAllMembersOfGroup } = require("./groups");
const { getUser, updateMultipleUsers } = require("./users");
const { NotificationErrors } = require("../utils/notificationErrors");
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Store push token for a user
async function storePushToken(request) {
  const { token } = request.params;
  const requestUserObject = request.user; // Get the user who called the function

  if (requestUserObject.get("expo_push_token") === token) {
    return { success: true, message: "Token already exists" };
  }

  try {
    const user = await getUser(requestUserObject.id);

    user.set("expo_push_token", token);
    await user.save(null, { useMasterKey: true });

    return { success: true, message: "Token stored successfully" };
  } catch (error) {
    throw new Error(`Failed to store push token: ${error.message}`);
  }
}

// Send notification to a choir group
/**
 *
 * @param {*} request
 * @returns
 */

// { "groupId":"2DDTYeG6X6", "title":"New Recordings", "message": "Check it out!" }
async function sendGroupNotification(request) {
  const { groupId, title, message } = request.params;
  const data = {};
  const tokenToUserMap = {};
  let tickets;
  let handlePushTicketsResult;
  let receipts;
  let handlePushReceiptResult;

  // We empty this variables later in the code.
  let membersWithPushTokens;

  if (!groupId || !title || !message) {
    throw new Error("Group ID, title, and message are required");
  }

  try {
    // OPTIMIZE: Get members with push tokens only.
    membersWithPushTokens = await getAllMembersOfGroup(groupId);
    membersWithPushTokens = membersWithPushTokens.filter((member) => {
      const pushToken = member.get("user_id").get("expo_push_token");
      return Expo.isExpoPushToken(pushToken);
    });

    // Create a map of push tokens to user IDs map
    membersWithPushTokens.forEach((member) => {
      const pushToken = member.get("user_id").get("expo_push_token");
      tokenToUserMap[pushToken] = member.get("user_id").id;
    });

    // clear the membersWithPushTokens array
    membersWithPushTokens = undefined;

    // Send notifications
    tickets = await notificationSender(Object.keys(tokenToUserMap), {
      title,
      body: message,
      data,
    });

    // filter tickets
    let { okTickets, errorTickets } = filterTickets(tickets);

    handlePushTicketsResult = await handlePushTicketsErrors(
      errorTickets,
      tokenToUserMap
    );

    // clear the errorTickets array
    errorTickets = undefined;

    // // get receipts Chunks

    await sleep(30000);
    receipts = await getReceiptsFromTickets(okTickets);

    handlePushReceiptResult = await handlePushReceiptErrors(
      receipts,
      tokenToUserMap
    );

    return {
      SentTo: handlePushReceiptResult.successfullReceiptsCount + " Users",
      DidNotSendTo:
        handlePushTicketsResult.failedTicketsCount +
        handlePushReceiptResult.failedReceiptsCount +
        " Users",
      FailedTickets: handlePushTicketsResult.failedTicketsCount + "",
      ResolvedTickets: handlePushTicketsResult.resolvedTicketsCount + "",
      FailedReceipts: handlePushReceiptResult.failedReceiptsCount + "",
      ResolvedReceipts: handlePushReceiptResult.resolvedReceiptsCount + "",
    };
  } catch (error) {
    throw new Error(`Failed to send group notification: ${error.message}`);
  }
}

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
      logErrorList(error, "Error sending notification chunk");
    }
  }

  return tickets;
}

function filterTickets(tickets) {
  let okTickets = [];
  let errorTickets = [];

  for (let ticket of tickets) {
    if (ticket.status === "ok") {
      okTickets.push(ticket);
    } else {
      errorTickets.push(ticket);
    }
  }

  return { okTickets, errorTickets };
}

/**
 * Handles push ticket errors
 * @param {Array<object>} errorTickets - The tickets to handle
 * @param {object} tokenToUserMap - The map of push tokens to user IDs
 * @returns {Promise<object>} The result object containing:
 *   - failedTicketsCount: number
 *   - resolvedTicketsCount: number
 *
 */
async function handlePushTicketsErrors(errorTickets, tokenToUserMap) {
  const result = {
    failedTicketsCount: 0,
    resolvedTicketsCount: 0,
  };
  let currentToken;
  const userIds = [];
  let didResetPushTokens = false;

  errorTickets.forEach((ticket) => {
    result.failedTicketsCount++;

    switch (ticket.details?.error) {
      case NotificationErrors.DeviceNotRegistered:
        // ticket will always contain the push token if we get a DeviceNotRegistered error.
        currentToken = ticket.details.expoPushToken;

        if (currentToken) {
          userIds.push(tokenToUserMap[currentToken]);
        }
        break;
      default:
        logError(
          `Failed to resolve a push ticket error`,
          ticket.details.error,
          ticket.message
        );
    }
  });

  didResetPushTokens = await resetPushTokens(userIds);

  if (didResetPushTokens) {
    result.resolvedTicketsCount = userIds.length;
  }

  return result;
}

/**
 * Resets the push tokens for the passed in userIds
 * @param {Array<string>} userIds - The userIds to update
 * @returns {Promise<boolean>} Whether the tickets were resolved
 */
async function resetPushTokens(userIds) {
  if (userIds.length > 0) {
    try {
      await updateMultipleUsers(userIds, {
        expo_push_token: "",
      });

      return true;
    } catch (error) {
      console.error("Failed to reset users push tokens:", error);
      return false;
    }
  }
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
  let temp;

  receiptIds = tickets.map((ticket) => ticket.id);
  receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  console.log("receiptIdChunks", receiptIdChunks);

  for (let chunk of receiptIdChunks) {
    // get receipts for each chunk
    console.log("chunk", chunk);

    receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);

    // we use for...in to iterate over the receiptChunk object
    // because the receiptChunk is an object containing multiple
    // receipts.
    for (let receiptId in receiptChunk) {
      receipts.push(receiptChunk[receiptId]);
    }
  }

  return receiptChunk;
}

/**
 * Handles errors in receipt objects and resets invalid push tokens
 * @param {Object} receiptObject - Object containing receipt details
 * @param {Object} tokenToUserMap - Map of push tokens to user IDs
 * @returns {Promise<Object>} Results of receipt processing
 */
async function handlePushReceiptErrors(receiptObject, tokenToUserMap) {
  const result = {
    successfullReceiptsCount: 0,
    failedReceiptsCount: 0,
    resolvedReceiptsCount: 0,
  };

  let currentToken;
  const userIds = [];

  // for...of: Use with arrays (gets values)
  // for...in: Use with objects (gets keys)
  Object.entries(receiptObject).forEach(([receiptId, receipt]) => {
    if (receipt.status === "ok") {
      result.successfullReceiptsCount++;
      return;
    }

    result.failedReceiptsCount++;

    switch (receipt.details?.error) {
      case NotificationErrors.DeviceNotRegistered:
        currentToken = receipt.details.expoPushToken;
        if (currentToken) {
          userIds.push(tokenToUserMap[currentToken]);
        }
        break;
      default:
        logError(
          "Failed to resolve a push receipt error",
          receipt.details?.error,
          receipt.message
        );
    }
  });

  const didResetPushTokens = await resetPushTokens(userIds);

  if (didResetPushTokens) {
    result.resolvedReceiptsCount = userIds.length;
  }

  return result;
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

async function checkTicketId(request) {
  const { ticketId } = request.params;
  // return ticketId;
  const receiptId = expo.chunkPushNotificationReceiptIds([ticketId]);
  // return receiptId;
  const receipt = await expo.getPushNotificationReceiptsAsync(receiptId[0]);
  return receipt;
}

module.exports = {
  storePushToken,
  sendGroupNotification,
  checkTicketId,
  handlePushTicketsErrors,
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
