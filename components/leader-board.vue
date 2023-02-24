<template>
  <div class="bg-indigo-200 rounded-lg p-2">
    <select class="mr-3 mb-2 p-1 rounded-md" v-model="division" @change="updateLeaderBoard()">
      <option v-for="division in getDivisions()">{{ division }}</option>
    </select>
    <select class="mb-2 p-1 rounded-md" v-model="event" @change="updateLeaderBoard()">
      <option v-for="event in getEvents()">{{ event }}</option>
    </select>
    <hr />
    <ol class="list-decimal list-inside mt-1">
      <li v-for="score in displayedScores.value">
        <span>{{ score.name }}: {{ score.displayScore }} <span class="mx-3">-</span> {{ teamPoints[score.name] }} Team Points {{ getBonusPointDisplay(score.bonus) }} </span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, getFirestore } from "@firebase/firestore"
import { getDivisions } from '~~/assets/event';
import { generateLeaderBoard, getTeamPoints } from '~~/assets/util';
import getEvents from "~~/assets/object-util";

// This script uses the composition API rather than the Options API.
const division = ref("Men's RX");
const event = ref("Week 1");
const displayedScores: any = reactive({ value: {} });
const scoringData = reactive((await getDoc(doc(getFirestore(), "athletes/scoring-data"))).data()!);
var teamPoints: any = reactive({});

const props = defineProps({
  scores: Object,
});

onMounted(() => {
  updateLeaderBoard()
})

function updateLeaderBoard() {
  displayedScores.value = generateLeaderBoard(props.scores, division.value, event.value);
  teamPoints = getTeamPoints(displayedScores.value, scoringData[division.value]);
}

function getBonusPointDisplay(bonusPoints: number): string {
  switch (bonusPoints) {
    case 0:
      return "";
    case 1:
      return "(+1 Bonus Point)";
    case -1:
      return "(-1 Bonus Point)";
    default:
      if (bonusPoints >= 2) {
        return `(+${bonusPoints} Bonus Points)`;
      } else {
        return `(${bonusPoints} Bonus Points)`;
      }
  }
}
</script>
