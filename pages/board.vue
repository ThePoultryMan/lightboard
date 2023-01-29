<template>
  <div class="w-full">
    <div class="flex">
      <!--Should be un-hardcoded for dynamic adjustment.-->
      <div v-for="team, index in teams" :class="[getTeamColor(team.color), index == 0 ? 'rounded-l-lg ml-3' : 'rounded-r-lg mr-3']" class="flex-1 h-10 mt-3" />
    </div>
    <!---->
    <div class="md:flex md:items-start">
      <Team v-for="team in teams" :team-name="team.name" :team-color="team.color" class="flex-1" />
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { TeamData } from "~/assets/team-data.js"

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
  },

  methods: {
    getTeamColor(color, amount) {
      if (amount == 200) {
        switch(color) {
          case "red":
            return "bg-red-200";
          case "blue":
            return "bg-blue-200";
        }
      }
      switch(color) {
        case "red":
          return "bg-red-300";
        case "blue":
          return "bg-blue-300";
      }
    },
  }
}
</script>
