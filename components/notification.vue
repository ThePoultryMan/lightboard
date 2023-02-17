<template>
  <Transition name="notification">
    <div v-show="props.show" class="w-96 p-3 bg-purple-200 rounded-lg">
      <h3 class="font-semibold">{{ props.message }}</h3>
      <p>{{ props.content }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  show: Boolean,
  message: String,
  content: String,
})
</script>

<style>
.notification-enter-active,
.notification-leave-active {
  transition: transform 0.5s linear;
}

.notification-enter-from,
.notification-leave-to {
  transform: translateX(100%);
}

.notification-enter-to,
.notification-leave-from {
  transform: translateX(0%);
}
</style>
