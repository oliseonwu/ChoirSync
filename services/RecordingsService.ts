import Parse from "@/services/Parse";
import { pointer } from "@/utilities/Helpers";

class RecordingsService {
  // fetch recordings from the server
  async fetchRecordings(
    groupId: string,
    page: number = 1,
    limit: number = 20,
    returnInClientFormat: boolean = true
  ) {
    try {
      const recordings = await Parse.Cloud.run("fetchRecordings", {
        groupId,
        page,
        limit,
        returnInClientFormat,
      });
      return recordings;
    } catch (error) {
      console.error("Error fetching recordings:", error);
      return { success: false, error: error };
    }
  }
}

export const recordingsService = new RecordingsService();
