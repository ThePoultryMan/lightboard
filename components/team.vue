<template>
  <div :class="[getTeamColor(teamColor)]" class="p-2 mb-3 rounded-lg">
    <div class="flex justify-between items-center">
      <h2 class="text-xl mb-2">{{ teamName }}</h2>
      <div class="text-right">
        <h3 class="m-1 -mb-1 font-semibold text-lg">{{ teamScores.total }}</h3>
        <p class="text-sm mr-1">Team Points</p>
      </div>
    </div>
    <button @click="showHideParticipants()" :class="[getTeamColor(teamColor, 200)]" class="px-2 mb-1 rounded-lg text-left text-md">
      <div>
        <p>Participants <Icon id="drop-icon" class="transition-transform duration-[350ms] rotate-180" name="material-symbols:keyboard-arrow-down-rounded" /></p>
      </div>
    </button>
    <Transition name="open">
      <div v-show="showParticipants.show" :id="'team-list-' + teamName" :class="[getTeamColor(teamColor, 200)]" class="flex flex-wrap gap-y-1 gap-x-4 overflow-hidden px-2 rounded-lg">
        <p v-for="participant in participants">
          {{ participant }}
        </p>
      </div>
    </Transition>
    <div class="w-full overflow-scroll">
      <div class="flex justify-evenly items-end h-[128px] w-[125%] sm:w-[110%] md:w-full border-b mt-5">
        <div :id="'Week 1-bar-' + teamName" class="flex items-center gap-3">
          <div class="mb-7">
            <h3>Week 1</h3>
            <h3 class="font-bold">{{ teamScores["Week 1"] }}</h3>
          </div>
          <div :class="[getTeamColor(teamColor, 400)]" class="h-full w-5 rounded-t-md" />
        </div>
        <div :id="'Week 2A-bar-' + teamName" class="flex items-center gap-3">
          <div class="mb-7">
            <h3>Week 2A</h3>
            <h3 class="font-bold">{{ teamScores["Week 2A"] }}</h3>
          </div>
          <div :class="[getTeamColor(teamColor, 400)]" class="h-full w-5 rounded-t-md" />
        </div>
        <div :id="'Week 2B-bar-' + teamName" class="flex items-center gap-3">
          <div class="mb-7">
            <h3>Week 2B</h3>
            <h3 class="font-bold">{{ teamScores["Week 2B"] }}</h3>
          </div>
          <div :class="[getTeamColor(teamColor, 400)]" class="h-full w-5 rounded-t-md" />
        </div>
        <div :id="'Week 3-bar-' + teamName" class="flex items-center gap-3">
          <div class="mb-7">
            <h3>Week 3</h3>
            <h3 class="font-bold">{{ teamScores["Week 3"] }}</h3>
          </div>
          <div :class="[getTeamColor(teamColor, 400)]" class="h-full w-5 rounded-t-md" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore';
import getEvents from "~~/assets/object-util";

export default {
  data() {
    return {
      showParticipants: {
        show: false,
        calculate: true,
      },
      participants: [],
      teamScores: {
        "Week 1": 0,
        "Week 2A": 0,
        "Week 2B": 0,
        "Week 3": 0,
        total: 0
      }
    }
  },
  props: {
    teamName: String,
    teamColor: {
      type: String,
      required: true,
    },
    scores: {
      required: true,
    },
    teamPoints: {
      type: Object,
      required: true,
    }
  },

  async mounted() {
    const database = getFirestore();
    const q = query(collection(database, "teams"), where("teamName", "==", this.$props.teamName));

    const result = await getDocs(q);
    result.forEach(team => {
      team.data().participants.forEach(participant => {
        this.participants.push(participant);
      });
    });

    this.prepareCss();

    // Team Scores
    const events = getEvents();
      events.forEach(event => {Object.entries(this.$props.teamPoints[event]).forEach(([participant, teamPoints]) => {
        if (this.participants.includes(participant)) this.teamScores[event] += teamPoints;
      });
      this.teamScores.total += this.teamScores[event];
    });
    events.forEach(event => {
      document.getElementById(event + '-bar-' + this.teamName).style.height = Math.max(128 * (this.teamScores[event] / this.teamScores.total), 24) + "px";
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
      } else if (amount == 400) {
        switch(color) {
        case "red":
          return "bg-red-400";
        case "blue":
          return "bg-blue-400";
        }
      }
      switch(color) {
        case "red":
          return "bg-red-300";
        case "blue":
          return "bg-blue-300";
      }
    },
    prepareCss() {
      const element = document.getElementById("team-list-" + this.teamName);
      const clone = element.cloneNode(true);

      Object.assign(clone.style, {
          overflow: 'visible',
          height: 'auto',
          maxHeight: 'none',
          opacity: '0',
          visibility: 'hidden',
          display: 'block',
      });

      element.after(clone);
      const height = clone.offsetHeight;

      clone.remove();
      document.querySelector(":root").style.setProperty("--height", height + "px");
    },
    showHideParticipants() {
      if (this.showParticipants.calculate) {
        this.prepareCss();
        this.showParticipants.calculate = false;
      }
      this.showParticipants.show = !this.showParticipants.show;
      const element = this.$el.querySelector("#drop-icon")
      element.classList.remove(this.showParticipants.show ? "rotate-180" : "rotate-0");
      element.classList.add(this.showParticipants.show ? "rotate-0" : "rotate-180");
    }
  },
}
</script>

<style>
:root {
  --height: 0px;
}

.open-enter-active, .open-leave-active {
  transition: max-height 0.35s;
}

.open-enter-from, .open-leave-to {
  max-height: 0;
}

.open-enter-to, .open-leave-from {
  max-height: var(--height);
}

.drop-icon {
  transform: rotate(180);
}
</style>
