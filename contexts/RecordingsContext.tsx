import { createContext, useContext, useState } from "react";
import { Recording } from "@/types/music.types";
import Parse from "@/services/Parse";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { pointer } from "@/utilities/Helpers";
import { recordingsService } from "@/services/RecordingsService";

type RecordingsContextType = {
  recordings: Recording[];
  isLoading: boolean;
  fetchRecordings: () => Promise<void>;
  resetRecordings: () => void;
};

const RecordingsContext = createContext<RecordingsContextType | undefined>(
  undefined
);

export function RecordingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentUserData } = useUser();

  const fetchRecordings = async () => {
    try {
      const { groupId } = getCurrentUserData();

      if (!groupId) {
        throw new Error("No group ID found");
      }

      const recordingsResponse =
        await recordingsService.fetchRecordings(groupId);

      console.log("recordingsResponse", recordingsResponse);

      if (!recordingsResponse.success) {
        throw new Error("Error fetching recordings");
      }

      console.log(
        "recordingsResponse.recordings",
        recordingsResponse.recordings
      );
      setRecordings(recordingsResponse.recordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetRecordings = () => {
    setRecordings([]);
    setIsLoading(false);
  };

  return (
    <RecordingsContext.Provider
      value={{ recordings, isLoading, fetchRecordings, resetRecordings }}
    >
      {children}
    </RecordingsContext.Provider>
  );
}

export const useRecordings = () => {
  const context = useContext(RecordingsContext);
  if (context === undefined) {
    throw new Error("useRecordings must be used within a RecordingsProvider");
  }
  return context;
};
