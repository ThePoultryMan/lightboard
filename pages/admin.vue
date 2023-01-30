<template>
  <div>
    <form v-if="!loggedIn" @submit.prevent="attemptLogin()" class="mt-5 ml-10">
      <h1>Admin Code:</h1>
      <input type="password" placeholder="..." v-model="code" class="bg-gray-300 rounded-md p-1 border-2 border-black" />
      <button type="submit" class="bg-blue-400 ml-3 p-1 rounded-md">Login</button>
    </form>
    <div v-else class="m-3">
      <div v-for="team in teams">
        <table class="w-full border-separate border-spacing-0">
          <tr>
            <th :class="'bg-' + [team.color] + '-300'" class="border-x border-t rounded-tl-lg">{{ team.name }}</th>
            <th v-for="event in events">
              {{ event.name }}
            </th>
          </tr>
          <tr v-for="participant in team.participants" :id="participant">
            <td class="">{{ participant }}</td>
            <td v-for="event in events" class="">
              <input :id="participant+event" :type="event.scoreType" v-model="scores[participant][event.name]" class="border border-gray-800 rounded-md px-1" />
            </td>
          </tr>
        </table>
        <button @click="saveScores(team)" class="bg-blue-300 rounded-md p-1">Save</button>
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
      scores: {},
    }
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
      console.log(document.data())
      return document.data();
    },
    async saveScores(team) {
      const component = this;
      const database = getFirestore();
      const documentReference = doc(database, "athletes", "scores");
      team.participants.forEach(async participant => {
        //if (documentSnapshot.data()[participant] != null) {
          const participantRow = this.$el.querySelector(`#${participant}`);
          let scores = Array.from(participantRow.getElementsByTagName("td"));
          scores.shift();
          scores = scores.map(function(element, index) {
            return [component.events[index], element.children[0].value];
          });
          
          const update = {
            [participant]: {}
          }

          // scores[0][0]
          scores.forEach(eventScore => {
            update[participant][eventScore[0].name] = eventScore[1];
          })

          await updateDoc(documentReference, update);
        //}
      });
    },
  },
}
</script>
