import type { Division, Participant, TeamScore } from "$lib";

export function sortLeaderboard(participants: TeamScore[]): TeamScore[] {
  if (participants && participants.length <= 1) return participants;
  return participants.sort((a, b) => a.scoreData.score.compare(b.scoreData.score));
}

export function getTeamScores(
  participants: Participant[],
  section: number,
  division: Division,
): TeamScore[] {
  let sectionScores: TeamScore[] = [];
  participants.forEach((participant, index) => {
    if (
      participant.scores &&
      participant.scores[section] &&
      participant.scores[section].division === division.index
    ) {
      sectionScores.push({
        name: participant.name,
        scoreData: participant.scores[section],
        adjustedScore: division.scoreStart - division.scoreDecrease * index,
      });
    }
  });
  return sectionScores;
}
