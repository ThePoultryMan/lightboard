<template>
  <div class="w-full">
    <!---->
    <div class="md:flex md:items-start m-3 gap-3">
      <Team v-for="team in teams" :team-name="team.name" :team-color="team.color" :scores="scores" class="flex-1" />
    </div>
    <!--Leader Board(s) todo: Add option to change type of leader boards displayed-->
    <LeaderBoard v-if="Object.keys(scores).length !== 0" :scores="scores" class="m-3" />
  </div>
</template>

<script setup lang="ts">
import { collection, doc, getDoc, getDocs, getFirestore } from "@firebase/firestore";
import { TeamData } from "~~/assets/team-data";

const teams: any = ref([]);
const scores = ref({});

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
});
</script>
