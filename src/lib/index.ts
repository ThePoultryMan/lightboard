import type { Score } from "./scoring";

export type Event = {
  metaData: EventMetaData;
  teams: TeamData[];
};

export type EventMetaData = {
  displayName: string;
  sections: Section[];
  divisions: Division[];
};

export type Section = {
  index: number;
  displayName: string;
};

export type Division = {
  displayName: String;
  index: number;
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
  division: number;
  score: Score;
};

export type TeamScore = {
  name: String;
  scoreData: ScoreData;
  adjustedScore: number,
};

export function emptyEvent() {
  return {
    metaData: {
      displayName: "loading",
      sections: [],
      divisions: [],
    },
    teams: [],
  } as Event;
}
