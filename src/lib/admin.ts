export enum Warning {
  DuplicateMembers,
}

export namespace Warning {
  export function toString(warning: Warning) {
    switch (warning) {
      case Warning.DuplicateMembers:
        return "You have two or more members with the same name, you won't be allowed to save until fixed.";
    }
  }
}
