import type { Participant, TeamScore } from "$lib";

export function sortLeaderboard(participants: TeamScore[]): TeamScore[] {
  if (participants && participants.length <= 1) return participants;
  return participants.sort((a, b) => a.scoreData.score.compare(b.scoreData.score));
}

export function getTeamScores(participants: Participant[], section: number): TeamScore[] {
  let sectionScores: TeamScore[] = [];
  let startScore = 40;
  let decay = 2;
  participants.forEach((participant, index) => {
    sectionScores.push({
      name: participant.name,
      scoreData: participant.scores[section],
      adjustedScore: startScore - (decay * index),
    });
  });
  return sectionScores;
}
