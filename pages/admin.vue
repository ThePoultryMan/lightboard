<template>
  <div>
    <form v-if="!loggedIn" @submit.prevent="attemptLogin()" class="mt-5 ml-10">
      <h1>Admin Code:</h1>
      <input type="password" placeholder="..." v-model="code" class="bg-gray-300 rounded-md p-1 border-2 border-black" />
      <button type="submit" class="bg-blue-400 ml-3 p-1 rounded-md">Login</button>
    </form>
    <div v-else class="m-3">
      <div v-for="team in teams" :class="['bg-' + team.color] + '-300'" class="my-3 p-1.5 rounded-lg">
        <table class="w-full">
          <tr>
            <th>{{ team.name }}</th>
            <th v-for="event in events">
              {{ event.name }}
            </th>
          </tr>
          <tr v-for="participant in team.participants" :id="participant">
            <td>{{ participant }}</td>
            <td v-for="event in events" class="text-center">
              <label :for="participant + event + 'division'">Division: </label>
              <select
                :id="participant + event + 'division'"
                v-if="isScoreDefined(participant, event.name)"
                v-model="scores[participant][event.name].division"
                class="rounded-md p-1 m-1"
              >
                <option selected disabled>Select an option...</option>
                <option v-for="division in divisions">{{ division }}</option>
              </select>
              <input
                v-if="isScoreDefined(participant, event.name)"
                :id="participant+event.name"
                :type="event.scoreType"
                v-model="scores[participant][event.name].score" class="border border-gray-800 rounded-md px-1"
              />
            </td>
          </tr>
        </table>
        <button @click="saveScores(team)" :class="['bg-' + team.color] + '-200'" class="rounded-md p-1">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc } from "@firebase/firestore";
import { fetchTeamData } from "~/assets/team-data"
import { Event } from "~/assets/event"

export default {
  data() {
    return {
      loggedIn: false,
      code: "",
      teams: [],
      events: [
        new Event("Week 1", "number"),
        new Event("Week 2", "number"),
        new Event("Week 3", "number"),
      ],
      divisions: [
        "Men's RX",
        "Women's RX",
        "Men's Scaled",
        "Women's Scaled",
      ],
      scores: {},
    }
  },
  computed: {
    dataExists() {
      const bool = this.scores?.coal["Week 1"].score !== undefined;
      return bool;
    },
  },

  async mounted() {
    const database = getFirestore();
    const q = query(collection(database, "teams"));
    this.teams = fetchTeamData(await getDocs(q));

    this.scores = await this.getScores();
  },

  methods: {
    attemptLogin() {
      if (this.code == "tpoultrym!") {
        this.loggedIn = true;
      }
    },
    async getScores() {
      const database = getFirestore();
      const documentReference = doc(database, "athletes", "scores");
      const document = await getDoc(documentReference);
      return document.data();
    },
    async saveScores(team) {
      const component = this;
      const database = getFirestore();
      const documentReference = doc(database, "athletes", "scores");
      
      updateDoc(documentReference, this.scores);
    },
    isScoreDefined(participant, eventName) {
      if (typeof this.scores[participant][eventName] === 'undefined') {
        this.scores[participant][eventName] = {
          division: "Select an option...",
          score: 0,
        };
      }

      return typeof this.scores[participant][eventName] !== 'undefined';
    }
  },
}
</script>
