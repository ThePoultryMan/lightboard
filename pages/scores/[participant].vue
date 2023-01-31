<template>
  <div class="m-5 lg:mx-1/5 p-3 bg-slate-300 rounded-lg">
    <div class="flex items-center">
      <h1 class="text-2xl">{{ $route.params.participant }}</h1>
      <h1 class="text-lg ml-12 self-end">{{ totalScore }}</h1>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, getFirestore } from '@firebase/firestore';

export default {
  data() {
    return {
      totalScore: 0,
    }
  },

  async mounted() {
    const database = getFirestore();
    const documentReference = doc(database, "athletes", "scores");
    const document = (await getDoc(documentReference)).data();

    if (document[this.$route.params.participant] != undefined) {
      let totalScore = 0;
      Object.values(document[this.$route.params.participant]).forEach(score => {
        totalScore += isNaN(score = parseInt(score)) ? 0 : score;
      });
      this.totalScore = totalScore;
    } else {
      this.totalScore = 0;
    }
  }
}
</script>
