export class TeamData {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.participants = []
  }

  useParticipants(participants) {
    this.participants = participants;
    return this;
  }
}

export function fetchTeamData(teams) {
  const teamData = [];
  teams.forEach(team => {
    teamData.push(new TeamData(team.data().teamName, team.data().teamColor).useParticipants(team.data().participants));
  });
  return teamData;
}
