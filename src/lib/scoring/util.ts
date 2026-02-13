import type { Division, Participant, TeamScore } from "$lib";
import { compareScores, type SortableScore, type SummedSectionScores } from ".";

export type SummedSectionScoreStats = {
  highest: number;
  lowest: number;
};

export function getTeamScores(scores: SortableScore[], division: Division): TeamScore[] {
  const teamScores: TeamScore[] = [];
  scores.sort((a, b) => {
    return compareScores(a, b);
  });

  scores.forEach((score, index) => {
    teamScores.push({
      name: score.name,
      score: score.score,
      adjustedScore: division.scoreStart - division.scoreDecrease * index,
      bonusPoints: score.bonusPoints,
    });
  });

  return teamScores;
}

export function getSortableScores(
  participants: Participant[],
  section: number,
  division: Division,
): SortableScore[] {
  let sortableScores: SortableScore[] = [];
  participants
    .filter(
      (participant) =>
        participant.scores &&
        participant.scores[section] &&
        participant.scores[section].division === division.index,
    )
    .forEach((participant, index) => {
      sortableScores.push({
        name: participant.name,
        score: participant.scores[section].score,
        scoreType: participant.scores[section].scoreType,
        bonusPoints: participant.scores[section].bonusPoints
          ? participant.scores[section].bonusPoints
          : 0,
      });
    });
  return sortableScores;
}

/**
 * Gets statics about the provided {@link SummedSectionScores}.
 * @param scores The scores to get stats from
 * @returns The calculated {@link SummedSectionScoreStats}
 */
export function getScoreStats(scores: SummedSectionScores): SummedSectionScoreStats {
  let highest = 0;
  // set to large number so that a low value can be found within the scores.
  let lowest = 1e10;
  for (const team of Object.keys(scores)) {
    for (const section of Object.keys(scores[team])) {
      const score = scores[team][section].score;
      if (score > highest) {
        highest = score;
      }
      if (score < lowest) {
        lowest = score;
      }
    }
  }

  return {
    highest,
    lowest,
  };
}
