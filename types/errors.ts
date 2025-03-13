export enum ErrorCode {
  // Auth Errors
  NOT_LOGGED_IN = "User is not logged in",
  INVALID_CREDENTIALS = "Invalid email or password",
  SESSION_EXPIRED = "Session expired, please login again",
  GOOGLE_SIGN_IN_FAILED = "Google sign in failed",

  // Profile Errors
  PROFILE_UPDATE_FAILED = "Failed to update profile",
  PROFILE_NOT_FOUND = "User profile not found",

  // Group Errors
  GROUP_NOT_FOUND = "Choir group not found",
  GROUP_JOIN_FAILED = "Failed to join choir group",
  GROUP_ACCESS_DENIED = "Access to choir group denied",

  // Invite Errors
  INVITE_INVALID = "Invalid invite code",
  INVITE_EXPIRED = "Invite code has expired",

  // Generic Errors
  NETWORK_ERROR = "Network connection error",
  SERVER_ERROR = "Server error occurred",
  UNKNOWN_ERROR = "An unknown error occurred",
}
