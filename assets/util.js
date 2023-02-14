export function generateLeaderBoard(scores, division, event) {
  // Filter out unneeded entries
  const filteredScores = {};
  Object.entries(scores).forEach(([name, score]) => {
    if (score[event].division == division) {
      const tempScore = {
        name: name,
        score: prepareScore(score[event].score),
        division: score[event].division,
        bonus: score[event].bonus,
        displayScore: score[event].score,
      };

      filteredScores.reversed = typeof score[event].score === "string";
      filteredScores[name] = tempScore;
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

  if (filteredScores.reversed) {
    sortedScores.reverse();
    sortedScores.pop();
  }

  return sortedScores;
}

export function getTeamPoints(sortedScores, scoringData) {
  const teamPoints = {};
  sortedScores.forEach((score, index) => {
    teamPoints[score.name] = scoringData.initial - (index * scoringData.decrease) + score.bonus;
  });
  return teamPoints;
}

function prepareScore(score) {
  if (typeof score === 'number') return score;
  else {
    const splitTime = score.split(":");
    return +splitTime[0] * 60 + +splitTime[1];
  }
}
