import type { Division, Participant, Section, TeamScore } from "$lib";

export function sortByIndex(array: Section[] | Division[]) {
  array.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0));
}

export function participantsIncludes(participants: Participant[], teamScore: TeamScore) {
  for (const participant of participants) {
    if (participant.name === teamScore.name) {
      return true;
    }
  }
  return false;
}
