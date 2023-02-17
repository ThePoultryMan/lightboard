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
      <li v-for="score in displayedScores.val">
        <span>{{ score.name }}: {{ score.displayScore }} <span class="mx-3">-</span> {{ teamPoints[score.name] }} Team Points</span>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { doc, getDoc, getFirestore } from "@firebase/firestore"
import { getDivisions } from '~~/assets/event';
import { generateLeaderBoard, getTeamPoints } from '~~/assets/util';

// This script uses the composition API rather than the Options API.
const division = ref("Men's RX");
const event = ref("Week 1");
const displayedScores = reactive({ val: 0 });
const scoringData = reactive((await getDoc(doc(getFirestore(), "athletes/scoring-data"))).data());
var teamPoints = reactive({});

const props = defineProps({
  scores: Object,
});

onMounted(() => {
  updateLeaderBoard()
})

function updateLeaderBoard() {
  displayedScores.val = generateLeaderBoard(props.scores, division.value, event.value);
  teamPoints = getTeamPoints(displayedScores.val, scoringData[division.value]);
}
</script>
