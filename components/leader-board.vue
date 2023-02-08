<template>
  <div>
    <select v-model="division" @change="updateLeaderBoard()">
      <option>Men's RX</option>
      <option>Women's RX</option>
    </select>
    <ol>
      <li v-for="score, index in displayedScores" :set="name = Object.keys(score)[0]">
        <span>{{ name }}: {{ score[name]["Week 1"].score }} - {{ displayedScores.length - index }} Team Points</span>
      </li>
    </ol>
  </div>
</template>

<script setup>
// This script uses the composition API rather than the Options API.
const division = ref("Men's RX");
const displayedScores = reactive([]);
const props = defineProps({
  scores: Object,
});

// todo: figure out a better way of storing scores and the like, so it's easier and more performant to access.
function updateLeaderBoard() {
  displayedScores.length = 0;
  for (const [name, score] of Object.entries(props.scores)) {
    if (score["Week 1"].division === division.value) {
      if (displayedScores.length > 0) {
        displayedScores.forEach((value, index) => {
          if (score["Week 1"].score > value[(Object.keys(value)[0])]["Week 1"].score) {
            displayedScores.push({ [name]: score });
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
</script>
