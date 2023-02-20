<template>
  <div class="w-full">
    <div v-if="Object.keys(props.scores).length !== 0">
      <div class="md:flex md:items-start m-3 gap-3">
        <Team v-for="team in teams" :team-name="team.name" :team-color="team.color" :scores="props.scores" class="flex-1" />
      </div>
      <!--Leader Board(s) todo: Add option to change type of leader boards displayed-->
      <LeaderBoard :scores="props.scores" class="m-3" />
    </div>
    <Icon v-else name="line-md:loading-twotone-loop" class="absolute top-1/2 left-1/2 w-28 h-28 -translate-xy-1/2 text-indigo-900" />
  </div>
</template>

<script setup lang="ts">
import { collection, doc, getDoc, getDocs, getFirestore } from "@firebase/firestore";
import { TeamData } from "~~/assets/team-data";

const props = defineProps({
  scores: {
    type: Object,
    required: true,
  },
});

const teams: any = ref([]);

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
});
</script>
