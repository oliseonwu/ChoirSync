import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

export type Song = {
  id: number;
  name: string;
  artist: string;
  link: string;
};

class SongService {
  async createSong(
    songName: string,
    artistName: string,
    link: string,
    db: SQLiteDatabase
  ) {
    const result = await db.runAsync(
      "INSERT INTO Songs (song_name, artist_name, link) VALUES (?, ?, ?)",
      songName,
      artistName,
      link
    );

    return result;
  }

  async getSongsByLink(link: string, db: SQLiteDatabase) {
    console.log("called getSongsByLink");
    const result = await db.getFirstAsync(
      "SELECT * FROM Songs WHERE link = ?",
      link
    );
    return result;
  }

  async deleteSong(link: string, db: SQLiteDatabase) {
    const result = await db.runAsync("DELETE FROM Songs WHERE link = ?", link);
    return result;
  }
}

export default new SongService();
