import type { Section } from "$lib";

export function sortSections(sections: Section[]) {
  sections.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0));
}
