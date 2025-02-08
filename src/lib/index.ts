export type Event = {
  metaData?: EventMetaData;
  teams: TeamData[];
};

export type EventMetaData = {
  displayName: string;
};

export type TeamData = {
  meta: {
    displayName: string;
  };
};

export function emptyEvent() {
  return {
    teams: []
  } as Event;
}
