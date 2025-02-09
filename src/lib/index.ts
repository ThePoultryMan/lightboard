import type { Score } from "./score";

export type Event = {
  metaData?: EventMetaData;
  teams: TeamData[];
};

export type EventMetaData = {
  displayName: string;
};

export type TeamData = {
  meta: {
    displayName: string;
  };
  participants: Participant[];
};

export type Participant = {
  name: string;
  scores: ScoreData;
};

export type ScoreData = {
  section: number;
  score: Score;
};

export function emptyEvent() {
  return {
    teams: [],
  } as Event;
}
