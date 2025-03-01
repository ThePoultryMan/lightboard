import type { Division, Participant, TeamScore } from "$lib";
import { compareScores, type SortableScore } from ".";

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
        bonusPoints: participant.scores[section].bonusPoints ? participant.scores[section].bonusPoints : 0,
      });
    });
  return sortableScores;
}
