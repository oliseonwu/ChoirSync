import { SQLiteDatabase } from "expo-sqlite";
const DATABASE_VERSION = 2; // The Latest version of my DB

class InitService {
  public setupDB = async (db: SQLiteDatabase) => {
    console.log("Setting up sqlite DB: ", db);
    try {
      let { user_version: deviceDbVersion } = (await db.getFirstAsync<{
        user_version: number;
      }>("PRAGMA user_version")) || { user_version: 0 };

      console.log("Device DB Version: ", deviceDbVersion);

      // to use the "this" we need to use the arrow function for setupDB
      await this.makeMigrations(db, deviceDbVersion);
    } catch (error) {
      console.error("[SQLite] Error setting up sqlite DB:", error);
    }
  };

  private async makeMigrations(db: SQLiteDatabase, deviceDbVersion: number) {
    console.log("Making migrations: ", deviceDbVersion);
    // If the DB is brand new, we need to update the DB schema
    // to match the lasest Version

    // If greater than or equal to the version of the DB,
    // we don't need to migrate because the DB schema is up to date
    if (deviceDbVersion >= DATABASE_VERSION) {
      return;
    }

    try {
      if (deviceDbVersion === 0) {
        // Create the Songs table
        await db.execAsync(
          "CREATE TABLE IF NOT EXISTS Songs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, singerName TEXT, link TEXT)"
        );
        deviceDbVersion = 1;
      }
      if (deviceDbVersion === 1) {
        // Create a table for users
        await db.execAsync(
          "CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)"
        );

        // Alter the Songs table to add user_id column
        await db.execAsync("ALTER TABLE Songs ADD COLUMN user_id INTEGER");

        deviceDbVersion = 2;
      }

      // its good to use if statements to seperate the migrations
      // because you can easily know what changed in the DB for
      // each version and also a way to track errors in the migration
      // process
      // if (deviceDbVersion === 1) {
      //   Add more migrations
      // }

      // Update the DB version
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    } catch (error) {
      // This will let us track which migrations are causing errors
      throw new Error(
        `[SQLite] Error making migrations: ${error}\nDEVICE_DB_VERSION = ${deviceDbVersion}\nDATABASE_VERSION = ${DATABASE_VERSION}`
      );
    }
  }
}

export default new InitService();
