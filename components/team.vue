<template>
  <div :class="[getTeamColor(teamColor)]" class="p-2 rounded-lg">
    <div class="flex justify-between">
      <h2 class="text-xl mb-2">{{ teamName }}</h2>
      <h3 class="text-right m-1">{{ "0" }}</h3>
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
  </div>
</template>

<script>
import { collection, getDoc, getDocs, getFirestore, query, where } from '@firebase/firestore';

export default {
  data() {
    return {
      showParticipants: {
        show: false,
        calculate: true,
      },
      participants: [],
    }
  },
  props: {
    teamName: String,
    teamColor: {
      type: String,
      required: true,
    },
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
  --height: 100px;
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
