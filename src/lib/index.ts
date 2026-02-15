import { ScoreType, type Score } from "./scoring";

export type EventData = {
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
  defaultScoreType: ScoreType;
};

export type Division = {
  displayName: string;
  index: number;
  scoreStart: number;
  scoreDecrease: number;
};

export type TeamData = {
  meta: {
    displayName: string;
    id: string;
  };
  participants: Participant[];
};

export type Participant = {
  name: string;
  scores: ScoreData[];
  defaultDivision?: number;
};

export interface ScoreData {
  section: number;
  division: number;
  scoreType: ScoreType;
  score: Score;
  bonusPoints: number;
}

export type TeamScore = {
  name: String;
  score: Score;
  adjustedScore: number;
  bonusPoints: number;
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
  } as EventData;
}

export namespace ScoreData {
  export function empty(section: number): ScoreData {
    return {
      section,
      division: 0,
      scoreType: "Time",
      score: undefined,
      bonusPoints: 0,
    };
  }
}
