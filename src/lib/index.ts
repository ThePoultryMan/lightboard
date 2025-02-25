import type { Score, ScoreType } from "./scoring";

export type Event = {
  metaData: EventMetaData;
  teams: TeamData[];
};

export type EventMetaData = {
  displayName: string;
  admins: String[]
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
  scoreStart: number;
  scoreDecrease: number;
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
  scoreType: ScoreType;
  score: Score;
};

export type TeamScore = {
  name: String;
  scoreData: ScoreData;
  adjustedScore: number;
};

export function emptyEvent() {
  return {
    metaData: {
      admins: [],
      displayName: "loading",
      sections: [],
      divisions: [],
    },
    teams: [],
  } as Event;
}
