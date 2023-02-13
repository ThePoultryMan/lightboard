<template>
  <div>
    <form v-if="!loggedIn" @submit.prevent="attemptLogin()" class="mt-5 ml-10">
      <h1>Admin Code:</h1>
      <input type="password" placeholder="..." v-model="code" class="bg-gray-300 rounded-md p-1 border-2 border-black" />
      <button type="submit" class="bg-blue-400 ml-3 p-1 rounded-md">Login</button>
    </form>
    <div v-else class="m-3">
      <button @click="saveScores()" class="bg-indigo-300 rounded-md p-2">Save Scores</button>
      <div v-for="team in teams" :class="['bg-' + team.color] + '-300'" class="my-3 p-1.5 rounded-lg">
        <table class="w-full border-separate border-spacing-x-0">
          <tr>
            <th>{{ team.name }}</th>
            <th v-for="event in events">
              {{ event.name }}
            </th>
          </tr>
          <tr v-for="participant in team.participants" :id="participant">
            <td class="border border-r-0 rounded-l-md pl-2">{{ participant }}</td>
            <td v-for="event, index in events" :class="{'border-r rounded-r-md': index == events.length - 1}" class="text-center border-y">
              <label :for="participant + event.name + 'division'">Division: </label>
              <select
                :id="participant + event.name + 'division'"
                v-if="isScoreDefined(participant, event.name)"
                v-model="scores[participant][event.name].division"
                class="rounded-md p-1 m-1"
              >
                <option selected disabled>Select an option...</option>
                <option v-for="division in divisions">{{ division }}</option>
              </select>
              <label :for="participant + event.name" class="pl-5">Score: </label>
              <input
                v-if="isScoreDefined(participant, event.name)"
                :id="participant + event.name"
                :type="event.scoreType"
                v-model="scores[participant][event.name].score"
                class="border border-gray-800 rounded-md w-20 p-1 m-1"
              />
              <label :for="participant + event.name + '-bonus'" class="pl-5">Bonus Team Points: </label>
              <input
                :id="participant + event.name + '-bonus'"
                type="number"
                v-model="scores[participant][event.name].bonus"
                class="border border-gray-800 rounded-md w-12 p-1 m-1"
              />
            </td>
          </tr>
        </table>
      </div>
      <div>
        <table class="bg-indigo-300 rounded-lg">
          <tr>
            <th>Name</th>
            <th>Initial</th>
            <th>Decrease</th>
          </tr>
          <tr v-for="name in Object.keys(scoringData)">
            <td>{{ name }}</td>
            <td><input type="number" v-model="scoringData[name].initial" /></td>
            <td><input type="number" v-model="scoringData[name].decrease" /></td>
          </tr>
        </table>
      </div>
      <button @click="saveScoringData()" class="bg-indigo-300 rounded-md p-2">Save Scoring Data</button>
    </div>
  </div>
</template>

<script>
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc } from "@firebase/firestore";
import { fetchTeamData } from "~/assets/team-data"
import { Event, getDivisions } from "~/assets/event"

export default {
  setup() {
    useHead({
      title: "Admin - Lightboard",
    });
  },
  
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
      divisions: getDivisions(),
      scores: {},
      scoringData: {},
    }
  },

  async mounted() {
    const database = getFirestore();
    const q = query(collection(database, "teams"));
    this.teams = fetchTeamData(await getDocs(q));

    this.scores = await this.getScores();

    this.scoringData = (await getDoc(doc(database, "athletes/scoring-data"))).data();
  },

  methods: {
    attemptLogin() {
      if (this.code == "tpoultrym!") {
        this.loggedIn = true;
      }
    },
    async getScores() {
      const database = getFirestore();
      const documentReference = doc(database, "athletes/scores");
      const document = await getDoc(documentReference);
      return document.data();
    },
    async saveScores() {
      const database = getFirestore();
      const documentReference = doc(database, "athletes/scores");
      
      updateDoc(documentReference, this.scores);
    },
    async saveScoringData() {
      const database = getFirestore();
      const documentReference = doc(database, "athletes/scoring-data");
      
      updateDoc(documentReference, this.scoringData);
    },
    isScoreDefined(participant, eventName) {
      if (typeof this.scores[participant] === 'undefined') {
        this.scores[participant] = {};
      }
      if (typeof this.scores[participant][eventName] === 'undefined') {
        this.scores[participant][eventName] = {
          division: "Select an option...",
          score: 0,
          bonus: 0,
        };
      }

      return true;
    }
  },
}
</script>
