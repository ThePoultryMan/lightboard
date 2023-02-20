<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <NuxtPage class="flex-1" :scores="scores" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, getFirestore } from '@firebase/firestore';

const scores: any = ref({});

onMounted(async () => {
  const database = getFirestore();
  const scoreDocument = getDoc(doc(database, "athletes", "scores"));
  scores.value = (await scoreDocument).data();
})
</script>
