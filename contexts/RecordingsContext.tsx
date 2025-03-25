import { createContext, useContext, useRef, useState } from "react";
import { Recording } from "@/types/music.types";
import Parse from "@/services/Parse";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { pointer } from "@/utilities/Helpers";
import { recordingsService } from "@/services/RecordingsService";

type RecordingsContextType = {
  recordings: Recording[];
  isLoading: boolean;
  fetchRecordings: (refresh?: boolean) => Promise<void>;
  resetRecordings: () => void;
  noMoreRecordings: boolean;
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
  const [noMoreRecordings, setNoMoreRecordings] = useState(false);
  const currentPageRef = useRef(1);
  let recordingsResponse: {
    success: boolean;
    recordings: Recording[];
    count: number;
  };

  const fetchRecordings = async () => {
    setIsLoading(true);
    try {
      const { groupId } = getCurrentUserData();

      if (!groupId) {
        throw new Error("No group ID found");
      }

      recordingsResponse = await recordingsService.fetchRecordings(
        groupId,
        currentPageRef.current
      );
      currentPageRef.current++;

      if (!recordingsResponse.success) {
        throw new Error("Error fetching recordings");
      }

      // If the response count is 0, we have reached the end of the recordings
      if (recordingsResponse.recordings.length === 0) {
        setNoMoreRecordings(true);
        return;
      }

      setRecordings([
        ...recordings,
        ...sanitizeNewRecordings(recordingsResponse.recordings),
      ]);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixes first rehearsal flag for paginated responses.
  // Backend logic is not full proof because sometimes
  // paginated responses may split recordings from same
  // rehearsal date across multiple requests.
  const sanitizeNewRecordings = (newRecordings: Recording[]) => {
    let lastRecord;

    if (recordings.length === 0) {
      return newRecordings;
    }

    lastRecord = recordings[recordings.length - 1];

    if (
      lastRecord.rehearsalDate.toDateString() ===
      newRecordings[0].rehearsalDate.toDateString()
    ) {
      newRecordings[0].isFirstRehearsalRecording = false;
    }

    return newRecordings;
  };

  const resetRecordings = () => {
    setRecordings([]);
    setIsLoading(false);
    currentPageRef.current = 1;
    setNoMoreRecordings(false);
  };

  return (
    <RecordingsContext.Provider
      value={{
        recordings,
        isLoading,
        fetchRecordings,
        resetRecordings,
        noMoreRecordings,
      }}
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
