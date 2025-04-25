/**
 * Utility functions shared across cloud functions
 *
 * Purpose:
 * - Reusable helper functions
 * - Common Parse operations (like creating pointers)
 * - Data transformation utilities
 * - Error handling utilities
 * - Date manipulation helpers
 * - Any other shared functionality
 *
 * Note: Keep functions pure and focused on a single responsibility
 */

function pointer(id, className = "ChoirGroups") {
  return {
    __type: "Pointer",
    className,
    objectId: id,
  };
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function random_between(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function returnMin(value1, value2) {
  return Math.min(value1, value2);
}

/**
 * Retries a callback function with exponential backoff
 * @param {Function} callback - Function to retry
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.baseDelay - Base delay in minutes (default: 1)
 * @param {number} options.maxDelay - Maximum delay cap in minutes (default: 2)
 */
async function retryWithBackoff(callback, options = {}) {
  const {
    maxRetries = 10,
    baseDelayInMinutes = 1,
    maxDelayInMinutes = 10,
  } = options;

  let retryCount = 1;

  while (retryCount <= maxRetries) {
    try {
      const result = await callback();
      if (result) {
        return { retryCount: retryCount, data: result };
      }
    } catch (error) {
      console.error(`Attempt ${retryCount} failed:`, error);
    }

    if (retryCount === maxRetries) {
      // throw new Error(`Failed after ${maxRetries} attempts`);
      console.log("Failed after max retries");
      break;
    }

    // Calculate sleep time with exponential backoff
    const delayMinutes = random_between(
      1,
      returnMin(maxDelayInMinutes, baseDelayInMinutes * Math.pow(2, retryCount))
    );

    console.log(
      `Sleeping for ${delayMinutes} minutes before retry ${retryCount}`
    );
    await sleep(delayMinutes * 60000); // Convert to milliseconds
    retryCount++;
  }
}

/**
 * Checks if current time is a specific day in Pacific Time
 * @param {number[]} validDays - Array of valid days (0-6, where 0 is Sunday)
 * @returns {boolean} True if current Pacific day is in validDays
 */
function isPacificTimeDay(validDays) {
  const pacificTime = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })
  );
  const pacificDay = pacificTime.getDay();
  return validDays.includes(pacificDay);
}

/**
 * Generates a random 6-digit alphanumeric code for OTP
 * @returns {string} 6-character alphanumeric code
 */
function generateOtpCode() {
  // Characters to use (alphanumeric excluding ambiguous characters)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Checks if a date has exceeded the current time plus a specified duration
 * @param {Date} date - Date to check
 * @param {number} timeMs - Time in milliseconds
 * @returns {boolean} True if date has exceeded (current time + timeMs)
 */
function isDateExpired(date, timeMs) {
  const currentDate = new Date();
  const timeDiff = currentDate - date;

  return timeDiff > timeMs;
}

// I moved this function here to avoid circular dependency
// between users and code functions
/**
 * Fetches a user by their email address.
 * @param {string} email - Email address to search for
 * @returns {Promise<Parse.User>} User object if found, otherwise null
 */
async function getUserByEmail(email) {
  try {
    const query = new Parse.Query(Parse.User);
    query.equalTo("email", email.toLowerCase());

    const user = await query.first({ useMasterKey: true });

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error(
      `Cloud error. Failed to fetch user by email: ${error.message}`
    );
  }
}

module.exports = {
  pointer,
  sleep,
  random_between,
  returnMin,
  retryWithBackoff,
  isPacificTimeDay,
  isEmailValid,
  generateOtpCode,
  isDateExpired,
  getUserByEmail,
};
