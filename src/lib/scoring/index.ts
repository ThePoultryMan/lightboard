import type { TeamScore } from "$lib";

export type Score = string | number | undefined;
export type ScoreType = "Time" | "Highest" | "Lowest";
export const ScoreTypes = ["Time", "Highest", "Lowest"];

export function compareScores(a: TeamScore, b: TeamScore, scoreType: ScoreType) {
  switch (scoreType) {
    case "Time": {
      let formattedA = a.scoreData.score as string;
      if (formattedA.length !== 5) {
        const splitA = (a.scoreData.score as string).split(":");
        splitA[0].padStart(2, "0");
        splitA[1].padStart(2, "0");
        formattedA = `${splitA[0]}:${splitA[1]}`;
      }
      let formattedB = b.scoreData.score as string;
      if (formattedB.length !== 5) {
        const splitB = (b.scoreData.score as String).split(":");
        splitB[0].padStart(2, "0");
        splitB[1].padStart(2, "0");
        formattedB = `${splitB[0]}:${splitB[1]}`;
      }
      return formattedA > formattedB ? 1 : formattedB > formattedA ? -1 : 0;
    }
    case "Highest": {
      const scoreA = a.scoreData.score as number;
      const scoreB = b.scoreData.score as number;
      return scoreB - scoreA;
    }
    case "Lowest": {
      const scoreA = a.scoreData.score as number;
      const scoreB = b.scoreData.score as number;
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
