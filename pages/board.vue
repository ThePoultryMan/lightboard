<template>
  <div class="w-full">
    <!---->
    <div v-if="Object.keys(teamPoints).length !== 0" class="md:flex md:items-start m-3 gap-3">
      <Team v-for="team in teams" :team-name="team.name" :team-color="team.color" :scores="scores" :team-points="teamPoints" class="flex-1" />
    </div>
    <!--Leader Board(s) todo: Add option to change type of leader boards displayed-->
    <LeaderBoard v-if="Object.keys(scores).length !== 0" :scores="scores" :team-points="teamPoints" class="m-3" />
  </div>
</template>

<script setup lang="ts">
import { collection, doc, getDoc, getDocs, getFirestore } from "@firebase/firestore";
import { getDivisions } from "~~/assets/event";
import getEvents from "~~/assets/object-util";
import { TeamData } from "~~/assets/team-data";
import { generateLeaderBoard, getTeamPoints } from "~~/assets/util";

const teams: any = ref([]);
const scores = ref({});

const teamPoints: any = ref({});

useHead({
  title: "Leader Board - Lightboard",
});

onMounted(async () => {
  const database = getFirestore();
  const result = collection(database, "teams");
  const teamsT = await getDocs(result);
  teamsT.forEach(team => {
    teams.value.push(new TeamData(team.data().teamName, team.data().teamColor));
  });

  // scores
  const documentReference = doc(database, "athletes", "scores");
  const fDocument = await getDoc(documentReference);
  const tempScores = fDocument.data();
  scores.value = tempScores ? tempScores : {};

  // Board page only (no components) team points.
  const scoringData = (await getDoc(doc(database, "athletes", "scoring-data"))).data()!;
  getEvents().forEach(event => {
    teamPoints.value[event] = {};
    getDivisions().forEach(division => {
      const leaderBoard = generateLeaderBoard(scores.value, division, event);
      teamPoints.value[event] = {...teamPoints.value[event], ...getTeamPoints(leaderBoard, scoringData[division])};
    });
  });
});
</script>
