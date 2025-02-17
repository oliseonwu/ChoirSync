import { createContext, useContext, useState } from "react";
import { Recording } from "@/types/music.types";
import Parse from "@/services/Parse";
import { authService } from "@/services/AuthService";

type RecordingsContextType = {
  recordings: Recording[];
  isLoading: boolean;
  fetchRecordings: () => Promise<void>;
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

  const fetchLastTwoRehearsalRecordings = (
    recordings: Parse.Object<Parse.Attributes>[]
  ) => {
    if (recordings.length === 0) return [];
    const firstRehearsalDate = recordings[0].get("rehearsal_date");
    let secondRehearsalDate: any = null;

    return recordings.filter((recording) => {
      const currentDate = recording.get("rehearsal_date");
      if (currentDate.toDateString() === firstRehearsalDate.toDateString()) {
        return true;
      }
      if (!secondRehearsalDate) {
        secondRehearsalDate = currentDate;
        return true;
      }
      return currentDate.toDateString() === secondRehearsalDate.toDateString();
    });
  };

  const fetchRecordings = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return;

      const membershipResult = await authService.checkChoirMembership(
        currentUser.id
      );
      if (!membershipResult.success || !membershipResult.isMember) return;

      const choirGroupId =
        membershipResult.choirMember?.get("choir_groups_id").id;

      const Recordings = Parse.Object.extend("Recordings");
      const query = new Parse.Query(Recordings);

      query.equalTo("choir_group_id", {
        __type: "Pointer",
        className: "ChoirGroups",
        objectId: choirGroupId,
      });

      query.include("category_id");
      query.descending("rehearsal_date");
      query.limit(15);

      const results = await query.find();
      const lastTwoRehearsalRecordings =
        fetchLastTwoRehearsalRecordings(results);

      const processedRecordings = lastTwoRehearsalRecordings.map(
        (recording) => ({
          id: recording.id,
          name: recording.get("name"),
          singerName: recording.get("singer_name"),
          channel: recording.get("channel"),
          link: recording.get("link"),
          file: recording.get("File"),
          isMultiTracked: recording.get("is_multi_tracked"),
          rehearsalDate: recording.get("rehearsal_date"),
          categoryId: recording.get("category_id")?.id,
          choirGroupId: recording.get("choir_group_id").id,
        })
      );

      setRecordings(processedRecordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecordingsContext.Provider
      value={{ recordings, isLoading, fetchRecordings }}
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
