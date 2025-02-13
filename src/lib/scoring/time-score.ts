import { Score } from ".";

export class TimeScore extends Score {
  constructor() {
    super("Time");
  }

  public setScore(score: string): void {
    if (score.length !== 5) {
      const split = score.split(":");
      split[0].padStart(2, "0");
      split[1].padStart(2, "0");
      super.setScore(`${split[0]}:${split[1]}`);
    } else {
      super.setScore(score);
    }
  }
}
