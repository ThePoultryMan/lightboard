<template>
  <div>
    <form v-if="!loggedIn" @submit.prevent="attemptLogin()" class="mt-5 ml-10">
      <h1>Admin Code:</h1>
      <input type="password" placeholder="..." v-model="code" class="bg-gray-300 rounded-md p-1 border-2 border-black" />
      <button type="submit" class="bg-blue-400 ml-3 p-1 rounded-md">Login</button>
    </form>
    <div v-else class="m-3">
      <div v-for="team in teams">
        <h1>{{ team.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore, query } from '@firebase/firestore';
import { fetchTeamData } from "~/team-data"

export default {
  data() {
    return {
      loggedIn: false,
      code: "",
      teams: [],
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
