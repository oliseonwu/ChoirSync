/**
 * Push Notification related cloud functions
 *
 * Purpose:
 * - Handle sending push notifications to users
 * - Manage notification tokens
 * - Group notification functions
 */

const { Expo } = require("expo-server-sdk");
const { getGroupMembersPushTokens } = require("./groups");
const { deletePushTokens } = require("./token");
const { NotificationErrors } = require("../utils/notificationErrors");
const { sleep } = require("../utils/helpers");
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

// Send notification to a choir group
/**
 *
 * @param {*} request
 * @returns
 */

async function sendGroupNotification(request) {
  const { groupId, title, message } = request.params;
  const data = {};
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

module.exports = {
  sendGroupNotification,
  handlePushTicketsandReceiptsErrors,
  notificationSender,
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
