import { SavedSong } from "@/types/music.types";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

class SongService {
  async createSong(
    songName: string,
    artistName: string,
    link: string,
    db: SQLiteDatabase
  ) {
    try {
      const result = await db.runAsync(
        "INSERT INTO Songs (name, singerName, link) VALUES (?, ?, ?)",
        songName,
        artistName,
        link
      );

      return result;
    } catch (error) {
      console.log("error creating song", error);
    }
  }

  async getSongsByLink(link: string, db: SQLiteDatabase) {
    try {
      const result: SavedSong | null = await db.getFirstAsync(
        "SELECT * FROM Songs WHERE link = ?",
        link
      );
      return result;
    } catch (error) {
      console.log("error getting songs by link", error);
    }
  }

  async deleteSong(link: string, db: SQLiteDatabase) {
    try {
      const result = await db.runAsync(
        "DELETE FROM Songs WHERE link = ?",
        link
      );
      return result;
    } catch (error) {
      console.log("error deleting song", error);
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
    try {
      const result: SavedSong[] = await db.getAllAsync(
        "SELECT * FROM Songs ORDER BY id DESC LIMIT ? OFFSET ?",
        limit,
        skip
      );
      return result;
    } catch (error) {
      console.log("error fetching songs", error);
    }
  }
}

export default new SongService();
