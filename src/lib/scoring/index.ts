export { TimeScore } from "./time-score";
export { HighestScore } from "./highest-score";

export abstract class Score {
  private scoreType: ScoreType;
  private score: string | number | undefined;

  constructor(scoreType: ScoreType) {
    this.scoreType = scoreType;
  }

  public getScoreType() {
    return this.scoreType;
  }

  public getScore() {
    return this.score;
  }

  public setScore(score: string | number) {
    this.score = score;
  }

  public clearScore() {
    this.score = undefined;
  }

  public compare(other: Score): number {
    const thisScore = this.getScore() as string;
    const otherScore = other.getScore() as string;
    return thisScore > otherScore ? 1 : otherScore > thisScore ? -1 : 0;
  };
}

export type ScoreType = "Time" | "Highest" | "Lowest";

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
