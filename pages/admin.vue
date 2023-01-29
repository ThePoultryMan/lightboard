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
          <tr v-for="participant in team.participants">
            <td class="">{{ participant }}</td>
            <td v-for="event in events" class="">
              <input :type="event.scoreType" class="border border-gray-800 rounded-md px-1" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore, query } from "@firebase/firestore";
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
    }
  },

  async mounted() {
    const database = getFirestore();
    const q = query(collection(database, "teams"));
    this.teams = fetchTeamData(await getDocs(q));
  },

  methods: {
    attemptLogin() {
      if (this.code == "tpoultrym!") {
        this.loggedIn = true;
      }
    }
  },
}
</script>
