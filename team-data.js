export class TeamData {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

export function fetchTeamData(teams) {
  const teamData = [];
  teams.forEach(team => {
    teamData.push(new TeamData(team.data().teamName, team.data().teamColor));
  });
  return teamData;
}
