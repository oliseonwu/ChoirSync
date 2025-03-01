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

module.exports = {
  pointer,
};
