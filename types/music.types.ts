export type Recording = {
  id: string;
  index: number;
  name: string;
  singerName: string;
  channel: "YT" | "file";
  link?: string;
  file?: string;
  isMultiTracked: boolean;
  rehearsalDate: Date;
  categoryId: string;
  choirGroupId: string;
  isFirstRehearsalRecording: boolean;
};

/**
 * A type for a new song. This songs are shown in the
 * members pickes page or new songs page.
 * @param id - The id of the song.
 * @param name - The name of the song.
 * @param singerName - The name of the singer.
 * @param focusThisWeek - Whether the song is focused this week.
 * @param link - The link to the song.
 */
export type NewSong = {
  id: string;
  name: string;
  singerName: string;
  focusThisWeek: boolean;
  link: string;
};

/**
 * A type for a saved song from sqlite DB
 * @param id - The id of the song.
 * @param name - The name of the song.
 * @param singerName - The name of the singer.
 * @param link - The link to the song.
 */
export type SavedSong = {
  id: number;
  name: string;
  singerName: string;
  link: string;
};
