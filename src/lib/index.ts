import type { Score } from "./scoring";

export type Event = {
  metaData: EventMetaData;
  teams: TeamData[];
};

export type EventMetaData = {
  displayName: string;
  sections: Section[];
};

export type Section = {
  index: number;
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
  scores: ScoreData[];
};

export type ScoreData = {
  section: number;
  score: Score;
};

export function emptyEvent() {
  return {
    metaData: {
      displayName: "loading",
      sections: [],
    },
    teams: [],
  } as Event;
}
