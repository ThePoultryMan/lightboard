<template>
  <div class="md:flex md:items-start">
    <Team v-for="team in teams" :team-name="team.name" :team-color="team.color" class="flex-1" />
  </div>
</template>

<script>
import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { TeamData } from "../team-data.js"

export default {
  data() {
    return {
      teams: []
    };
  },

  async mounted() {
    const database = getFirestore();
    const result = collection(database, "teams");
    const teams = await getDocs(result);
    teams.forEach(team => {
      this.teams.push(new TeamData(team.data().teamName, team.data().teamColor));
    });
  }
}
</script>
