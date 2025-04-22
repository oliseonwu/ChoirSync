/**
 * Application-wide constants and configuration values
 *
 * Purpose:
 * - Store all magic numbers and strings
 * - Define time-related constants
 * - Define Parse class names
 * - Define role names and permissions
 * - Any other app-wide configuration values
 *
 * Note: Do not store sensitive information here (use environment variables instead)
 */

module.exports = {
  // INVITE_CODE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  INVITE_CODE_EXPIRY: 60 * 24 * 60 * 60 * 1000, // 60 days (2 months) in milliseconds

  MIN_REMAINING_TIME: 60 * 60 * 1000, // 1 hour in milliseconds
};
