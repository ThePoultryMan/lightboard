export class Event {
  constructor(name, scoreType) {
    this.name = name;
    this.scoreType = scoreType;
  }
}

export function getDivisions() {
  return [
    "Men's RX",
    "Women's RX",
    "Men's Scaled",
    "Women's Scaled",
    "Teens (Scaled & RX)",
  ];
}
