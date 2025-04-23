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

module.exports = {
  pointer,
  sleep,
  random_between,
  returnMin,
  retryWithBackoff,
  isPacificTimeDay,
  isEmailValid,
};
