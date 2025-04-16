import { SQLiteDatabase } from "expo-sqlite";

/**
 * User object representing a row in the Users table
 */
interface User {
  id: number;
  username: string;
}

class UserService {
  /**
   * Creates a new user in the database
   * @param username - The username for the new user
   * @param db - The database instance
   * @returns The result of the insert operation
   */
  async createUser(username: string, db: SQLiteDatabase) {
    try {
      const result = await db.runAsync(
        "INSERT INTO Users (username) VALUES (?)",
        username
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error creating user:", error);
    }
  }

  /**
   * Gets a user by their ID
   * @param id - The user ID to look up
   * @param db - The database instance
   * @returns The user object or null if not found
   */
  async getUserById(id: number, db: SQLiteDatabase) {
    try {
      const result: User | null = await db.getFirstAsync(
        "SELECT * FROM Users WHERE id = ?",
        id
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error getting user by ID:", error);
      return null;
    }
  }

  /**
   * Gets a user by their username
   * @param username - The username to look up
   * @param db - The database instance
   * @returns The user object or null if not found
   */
  async getUserByUsername(username: string, db: SQLiteDatabase) {
    try {
      const result: User | null = await db.getFirstAsync(
        "SELECT * FROM Users WHERE username = ?",
        username
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error getting user by username:", error);
      return null;
    }
  }

  /**
   * Updates a user's username
   * @param id - The ID of the user to update
   * @param newUsername - The new username
   * @param db - The database instance
   * @returns The result of the update operation
   */
  async updateUsername(id: number, newUsername: string, db: SQLiteDatabase) {
    try {
      const result = await db.runAsync(
        "UPDATE Users SET username = ? WHERE id = ?",
        newUsername,
        id
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error updating username:", error);
    }
  }

  /**
   * Deletes a user from the database
   * @param id - The ID of the user to delete
   * @param db - The database instance
   * @returns The result of the delete operation
   */
  async deleteUser(id: number, db: SQLiteDatabase) {
    try {
      const result = await db.runAsync("DELETE FROM Users WHERE id = ?", id);
      return result;
    } catch (error) {
      console.error("[SQLite] Error deleting user:", error);
    }
  }

  /**
   * Gets all users from the database
   * @param db - The database instance
   * @param limit - Maximum number of users to return
   * @param offset - Number of users to skip
   * @returns Array of user objects
   */
  async getAllUsers(db: SQLiteDatabase, limit = 100, offset = 0) {
    try {
      const result: User[] = await db.getAllAsync(
        "SELECT * FROM Users LIMIT ? OFFSET ?",
        limit,
        offset
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error getting all users:", error);
      return [];
    }
  }
}

export default new UserService();
