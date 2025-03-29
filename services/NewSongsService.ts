import { NewSong } from "@/types/music.types";
import Parse from "./Parse";

export type NewSongsResponse = {
  success: boolean;
  error?: Error;
  returnedSongs?: {
    focusedSongDetected: boolean;
    focusedSongs: NewSong[];
    unFocusedSongs: NewSong[];
  };
};
class NewSongsService {
  // fetch recordings from the server
  async fetchNewSongs(
    groupId: string,
    page: number = 1,
    limit: number = 20,
    returnInClientFormat: boolean = true
  ): Promise<NewSongsResponse> {
    try {
      const newSongs = await Parse.Cloud.run("fetchNewSongs", {
        groupId,
        page,
        limit,
        returnInClientFormat,
      });
      return newSongs;
    } catch (error) {
      console.error("Error fetching new songs:", error);
      return { success: false, error: error as Error };
    }
  }
}

export default new NewSongsService();
