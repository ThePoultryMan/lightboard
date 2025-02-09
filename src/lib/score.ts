export class Score {
  private scoreType: ScoreType;
  private section: number;
  private score: string | number | undefined;

  constructor(scoreType: ScoreType, section: number, displayName: string) {
    this.scoreType = scoreType;
    this.section = section;
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
}

export class TimeScore extends Score {
  constructor(section: number) {
    super(ScoreType.Time, section, "Time");
  }
}

export enum ScoreType {
  Time,
}

export namespace ScoreType {
  export function toString(scoreType: ScoreType) {
    switch (scoreType) {
      case ScoreType.Time:
        return "Time";
    }
  }
}
