import { SQLiteDatabase } from "expo-sqlite";
const DATABASE_VERSION = 1; // The Latest version of my DB

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

      // Update the DB version
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    } catch (error) {
      console.error("Error occured setting up sqlite DB: ", error);
    }
  };

  private async makeMigrations(db: SQLiteDatabase, deviceDbVersion: number) {
    console.log("Making migratios: ", deviceDbVersion);
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

      // its good to use if statements to seperate the migrations
      // because you can easily know what changed in the DB for
      // each version and also a way to track errors in the migration
      // process
      // if (deviceDbVersion === 1) {
      //   Add more migrations
      // }
    } catch (error) {
      // This will let us track which migrations are causing errors
      throw new Error(
        `Error making migrations(sqlite DB): ${error}\nDEVICE_DB_VERSION = ${deviceDbVersion}\nDATABASE_VERSION = ${DATABASE_VERSION}`
      );
    }
  }
}

export default new InitService();
