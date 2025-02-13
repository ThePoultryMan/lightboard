import type { Participant, TeamScore } from "$lib";

export function sortLeaderboard(participants: TeamScore[]): TeamScore[] {
  if (participants && participants.length <= 1) return participants;
  return participants.sort((a, b) => a.scoreData.score.compare(b.scoreData.score));
}

// Relies on participant scores being sorted by section.
export function getTeamScore(participant: Participant, section: number): TeamScore {
  return {
    name: participant.name,
    scoreData: participant.scores[section],
  };
}

export function getTeamScores(participants: Participant[], section: number): TeamScore[] {
  let sectionScores = [];
  for (const participant of participants) {
    sectionScores.push(getTeamScore(participant, section));
  }
  return sectionScores;
}
