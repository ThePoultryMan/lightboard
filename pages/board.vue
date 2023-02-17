<template>
  <div class="w-full">
    <!---->
    <div class="md:flex md:items-start m-3 gap-3">
      <Team v-for="team in teams" :team-name="team.name" :team-color="team.color" :scores="scores" class="flex-1" />
    </div>
    <!--Leader Board(s) todo: Add option to change type of leader boards displayed-->
    <LeaderBoard v-if="scores" :scores="scores" class="m-3" />
  </div>
</template>

<script>
import { collection, doc, getDoc, getDocs, getFirestore } from "@firebase/firestore";
import { TeamData } from "~~/assets/team-data.js"

export default {
  setup() {
    useHead({
      title: "Leader Board - Lightboard",
    });
  },

  data() {
    return {
      teams: [],
      scores: undefined,
    };
  },

  async mounted() {
    const database = getFirestore();
    const result = collection(database, "teams");
    const teamsT = await getDocs(result);
    teamsT.forEach(team => {
      this.teams.push(new TeamData(team.data().teamName, team.data().teamColor));
    });

    // scores
    const documentReference = doc(database, "athletes", "scores");
    const fDocument = await getDoc(documentReference);
    this.scores = fDocument.data();
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
