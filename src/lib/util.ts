import type { Division, Section } from "$lib";

export function sortByIndex(array: Section[] | Division[]) {
  array.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0));
}
