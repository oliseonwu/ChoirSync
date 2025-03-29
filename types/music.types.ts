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

export type NewSong = {
  id: string;
  name: string;
  singerName: string;
  artistName: string;
  focusThisWeek: boolean;
  link: string;
};
