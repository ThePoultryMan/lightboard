<template>
  <div class="bg-indigo-200 rounded-lg p-2">
    <select class="mr-3 mb-2 p-1 rounded-md" v-model="division" @change="updateLeaderBoard()">
      <option>Men's RX</option>
      <option>Women's RX</option>
    </select>
    <select class="mb-2 p-1 rounded-md" v-model="event" @change="updateLeaderBoard()">
      <option>Week 1</option>
      <option>Week 2</option>
      <option>Week 3</option>
    </select>
    <hr />
    <ol class="list-decimal list-inside mt-1">
      <li v-for="score, index in displayedScores" :set="name = Object.keys(score)[0]">
        <span>{{ name }}: {{ score[name]["Week 1"].score }} - {{ getTeamPoints(index) }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup>
// This script uses the composition API rather than the Options API.
const division = ref("Men's RX");
const event = ref("Week 1");
const displayedScores = reactive([]);
const props = defineProps({
  scores: Object,
});

// todo: figure out a better way of storing scores and the like, so it's easier and more performant to access.
function updateLeaderBoard() {
  displayedScores.length = 0;
  for (const [name, score] of Object.entries(props.scores)) {
    if (score[event.value].division === division.value) {
      if (displayedScores.length > 0) {
        displayedScores.forEach((value, index) => {
          if (score[event.value].score > value[(Object.keys(value)[0])][event.value].score) {
            displayedScores.splice(index, 0, { [name]: score });
          } else if (index == (displayedScores.length - 1)) {
            displayedScores.push({ [name]: score });
          }
        })
      } else {
        displayedScores.push({ [name]: score });
      }
    }
  }
}

function getTeamPoints(ranking) {
  const points = displayedScores.length - ranking;
  return points == 1 ? "1 Team Point" : points + " Team Points";
}
</script>
