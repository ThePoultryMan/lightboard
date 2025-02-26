export enum Warning {
  DuplicateMembers,
  DuplicateSectionNames,
  DuplicateSectionIndexes,
}

export namespace Warning {
  export function toString(warning: Warning) {
    switch (warning) {
      case Warning.DuplicateMembers:
        return "You have two or more members with the same name, you won't be allowed to save until fixed.";
      case Warning.DuplicateSectionNames:
        return "Two or more sections have the same name, you won't be allowed to save until fixed.";
      case Warning.DuplicateSectionIndexes:
        return "Two or more sections have the same index, you won't be allowed to save until fixed.";
    }
  }
}
