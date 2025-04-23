import { SavedSong } from "@/types/music.types";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import Parse from "../Parse";

class SongService {
  async createSong(
    songName: string,
    artistName: string,
    link: string,
    db: SQLiteDatabase
  ) {
    try {
      const currentUser = await Parse.User.currentAsync();

      if (!currentUser) {
        throw new Error("No user found");
      }

      const result = await db.runAsync(
        "INSERT INTO Songs (name, singerName, link, user_id) VALUES (?, ?, ?, ?)",
        songName,
        artistName,
        link,
        currentUser.id
      );

      return result;
    } catch (error) {
      console.error("[SQLite] Error creating song:", error);
    }
  }

  async getSongsByLink(link: string, db: SQLiteDatabase) {
    if (!link) {
      return null;
    }

    try {
      const currentUser = await Parse.User.currentAsync();

      if (!currentUser) {
        throw new Error("No user found");
      }

      const result: SavedSong | null = await db.getFirstAsync(
        "SELECT * FROM Songs WHERE link = ? AND (user_id = ? OR user_id IS NULL)",
        link,
        currentUser.id
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error getting songs by link:", error);
    }
  }

  async deleteSong(link: string, db: SQLiteDatabase) {
    try {
      const currentUser = await Parse.User.currentAsync();

      if (!currentUser) {
        throw new Error("No user found");
      }

      const result = await db.runAsync(
        "DELETE FROM Songs WHERE link = ? AND (user_id = ? OR user_id IS NULL)",
        link,
        currentUser.id
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error deleting song:", error);
    }
  }

  /**
   * Fetches songs from the database
   * @param db - The database instance
   * @param page - The page number to fetch
   * @param limit - The number of songs to fetch
   * @returns An array of songs.
   */
  async fetchSongs(db: SQLiteDatabase, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const currentUser = await Parse.User.currentAsync();

    try {
      if (!currentUser) {
        throw new Error("No user found");
      }

      const result: SavedSong[] = await db.getAllAsync(
        "SELECT * FROM Songs WHERE user_id = ? OR user_id IS NULL ORDER BY id DESC LIMIT ? OFFSET ?",
        currentUser.id,
        limit,
        skip
      );
      return result;
    } catch (error) {
      console.error("[SQLite] Error fetching songs:", error);
    }
  }
}

export default new SongService();
