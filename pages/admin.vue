<template>
  <div>
    <ClientOnly>
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
                  :type="event.scoreType !== 'time' ? event.scoreType : 'text'"
                  v-model="scores[participant][event.name].score"
                  class="border border-gray-800 rounded-md w-20 p-1 m-1"
                />
                <br />
                <label :for="participant + event.name + '-bonus'" class="pl-5">Bonus Team Points: </label>
                <input
                  :id="participant + event.name + '-bonus'"
                  type="number"
                  v-model="scores[participant][event.name].bonus"
                  class="border border-gray-800 rounded-md w-12 p-1 m-1"
                />
                <br />
                <label :for="participant + event.name + '-dropped'">Drop Score: </label>
                <input :id="participant + event.name + '-dropped'" type="checkbox" v-model="scores[participant][event.name].dropped" class="m-1" />
              </td>
            </tr>
          </table>
        </div>
        <div class="bg-indigo-300 rounded-lg p-1.5 my-3 w-1/3">
          <table class="w-full">
            <tr>
              <th>Name</th>
              <th>Initial</th>
              <th>Decrease</th>
            </tr>
            <tr v-for="name in Object.keys(scoringData)" class="text-center">
              <td>{{ name }}</td>
              <td>
                <input type="number" v-model="scoringData[name].initial" class="border border-gray-800 rounded-md w-12 p-1 m-1"/>
              </td>
              <td>
                <input type="number" v-model="scoringData[name].decrease" class="border border-gray-800 rounded-md w-12 p-1 m-1" />
              </td>
            </tr>
          </table>
        </div>
        <button @click="saveScoringData()" class="bg-indigo-300 rounded-md p-2">Save Scoring Data</button>
      </div>
      <Notification
        :show="savedNotification.show"
        :message="savedNotification.message + ' Saved!'"
        :content="savedNotification.message + ' have been saved successfully.'"
        @close="savedNotification.show = false"
        class="fixed top-5 right-5"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc } from "@firebase/firestore";
import { fetchTeamData } from "~~/assets/team-data.js"
import { Event, getDivisions } from "~/assets/event"

const loggedIn = ref(false);
const code = ref("");
const teams: any = ref([]);
const events = ref([
  new Event("Week 1", "number"),
  new Event("Week 2", "time"),
  new Event("Week 3", "number"),
]);
const divisions = ref(getDivisions());
var scores: Record<string, any> = reactive({});
var scoringData: any = reactive({});
var savedNotification = ref({
  show: false,
  message: "Scores",
});

useHead({
  title: "Admin - Lightboard",
});

onMounted(async () => {
  const database = getFirestore();
  const q = query(collection(database, "teams"));
  teams.value = fetchTeamData(await getDocs(q));
  const tempScores = await getScores();
  scores = tempScores ? tempScores : {};
  scoringData = (await getDoc(doc(database, "athletes/scoring-data"))).data();
})

function attemptLogin() {
  if (code.value === "tpoultrym!") {
    loggedIn.value = true; 
  }
}
async function getScores() {
  const database = getFirestore();
  const documentReference = doc(database, "athletes/scores");
  const document = await getDoc(documentReference);
  return document.data();
}
async function saveScores() {
  const database = getFirestore();
  const documentReference = doc(database, "athletes/scores");
  
  updateDoc(documentReference, scores);
  savedNotification.value.show = true;
  savedNotification.value.message = "Scores"
  setTimeout(() => savedNotification.value.show = false, 3270);
}
async function saveScoringData() {
  const database = getFirestore();
  const documentReference = doc(database, "athletes/scoring-data");
  
  updateDoc(documentReference, scoringData);
  savedNotification.value.show = true;
  savedNotification.value.message = "Scoring Data";
  setTimeout(() => savedNotification.value.show = false, 3270);
}
function isScoreDefined(participant: string, eventName: string) {
  if (typeof scores[participant] === 'undefined') {
    scores[participant] = {};
  }
  if (typeof scores[participant][eventName] === 'undefined') {
    scores[participant][eventName] = {
      division: "Select an option...",
      score: 0,
      bonus: 0,
      dropped: false,
    };
  }
  return true;
}
</script>
