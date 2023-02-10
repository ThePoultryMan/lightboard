<template>
  <div class="bg-indigo-200 rounded-lg p-2">
    <select class="mr-3 mb-2 p-1 rounded-md" v-model="division" @change="updateLeaderBoard()">
      <option v-for="division in getDivisions()">{{ division }}</option>
    </select>
    <select class="mb-2 p-1 rounded-md" v-model="event" @change="updateLeaderBoard()">
      <option>Week 1</option>
      <option>Week 2</option>
      <option>Week 3</option>
    </select>
    <hr />
    <ol class="list-decimal list-inside mt-1">
      <li v-for="score, index in displayedScores">
        <span>{{ score.name }}: {{ score.score }} - {{ teamPoints[score.name] }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { getDivisions } from '~~/assets/event';
import { generateLeaderBoard, getTeamPoints } from '~~/assets/util';

// This script uses the composition API rather than the Options API.
const division = ref("Men's RX");
const event = ref("Week 1");
var displayedScores = reactive({});
var teamPoints = reactive({});

const props = defineProps({
  scores: Object,
});

// todo: figure out a better way of storing scores and the like, so it's easier and more performant to access.
function updateLeaderBoard() {
  displayedScores = generateLeaderBoard(props.scores, division.value, event.value);
  teamPoints = getTeamPoints(displayedScores);
}
</script>
