<template>
  <div class="m-3 mt-12 text-center">
    <h1 class="font-semibold text-2xl my-3">I would like to give a special thank you to the following projects:</h1>
    <ul>
      <li v-for="project in projects" class="text-lg mb-4">
        <p class="font-semibold">{{ project.name }}</p>
        <p>{{ project.reason }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import projects from "~~/assets/data/projects.json"

useHead({
  title: "A Special Thank You - Lightboard",
})
</script>
