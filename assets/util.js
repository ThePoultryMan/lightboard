export function generateLeaderBoard(scores, division, event) {
  // Filter out unneeded entries
  const filteredScores = {};
  Object.entries(scores).forEach(([name, score]) => {
    if (score[event].division == division) {
      filteredScores[name] = score[event];
      filteredScores[name].name = name;
    }
  });
  // Sort entries into new object.
  const sortedScores = [];
  Object.values(filteredScores).forEach((score, index) => {
    if (index > 0) {
      sortedScores.forEach((sortedScore, sortedIndex) => {
        if (score.score > sortedScore.score) {
          sortedScores.splice(sortedIndex, 0, score);
        } else if (sortedIndex == sortedScores.length - 1) {
          sortedScores.push(score);
        }
      });
    } else {
      sortedScores.push(score);
    }
  });

  return sortedScores;
}

export function getTeamPoints(sortedScores) {
  const teamPoints = {};
  sortedScores.forEach((score, index) => {
    teamPoints[score.name] = sortedScores.length - index + score.bonus;
  });
  return teamPoints;
}
