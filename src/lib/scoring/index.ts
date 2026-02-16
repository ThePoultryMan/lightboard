export type Score = string | number | undefined;
export type SortableScore = {
  name: string;
  score: Score;
  scoreType: ScoreType;
  bonusPoints: number;
};
export type ScoreType = "Time" | "Highest" | "Lowest";
export const ScoreTypes = ["Time", "Highest", "Lowest"];

export type SummedSectionScores = {
  [team: string]: {
    [section: string]: {
      score?: number;
      bonusPoints?: number;
    };
  };
};

export function compareScores(a: SortableScore, b: SortableScore) {
  switch (a.scoreType) {
    case "Time": {
      let formattedA = a.score as string;
      if (formattedA.length !== 5) {
        const splitA = (a.score as string).split(":");
        splitA[0].padStart(2, "0");
        splitA[1].padStart(2, "0");
        formattedA = `${splitA[0]}:${splitA[1]}`;
      }
      let formattedB = b.score as string;
      if (formattedB.length !== 5) {
        const splitB = (b.score as String).split(":");
        splitB[0].padStart(2, "0");
        splitB[1].padStart(2, "0");
        formattedB = `${splitB[0]}:${splitB[1]}`;
      }
      return formattedA > formattedB ? 1 : formattedB > formattedA ? -1 : 0;
    }
    case "Highest": {
      const scoreA = a.score as number;
      const scoreB = b.score as number;
      return scoreB - scoreA;
    }
    case "Lowest": {
      const scoreA = a.score as number;
      const scoreB = b.score as number;
      return scoreA - scoreB;
    }
  }
}

export namespace ScoreType {
  export function toString(type: ScoreType) {
    switch (type) {
      case "Time":
        return "Time - Quickest";
      case "Highest":
        return "Highest";
      case "Lowest":
        return "Lowest";
    }
  }
}
