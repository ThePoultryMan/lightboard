import { Score } from ".";

export class HighestScore extends Score {
  constructor() {
    super("Highest");
  }

  public compare(other: Score) {
    return (other.getScore() as number) - (this.getScore() as number);
  }
}
