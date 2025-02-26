import type { Division, Participant, TeamScore } from "$lib";
import { compareScores } from ".";

export function sortLeaderboard(participants: TeamScore[]): TeamScore[] {
  if (participants && participants.length <= 1) return participants;
  return participants.sort((a, b) => {
    return compareScores(a, b, a.scoreData.scoreType);
  });
}

export function getTeamScores(
  participants: Participant[],
  section: number,
  division: Division,
): TeamScore[] {
  let sectionScores: TeamScore[] = [];
  participants
    .filter(
      (participant) =>
        participant.scores &&
        participant.scores[section] &&
        participant.scores[section].division === division.index,
    )
    .forEach((participant, index) => {
      sectionScores.push({
        name: participant.name,
        scoreData: participant.scores[section],
        adjustedScore: division.scoreStart - division.scoreDecrease * index,
      });
    });
  return sectionScores;
}
