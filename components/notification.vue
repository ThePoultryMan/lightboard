<template>
  <Transition name="notification">
    <div v-show="props.show" class="w-96 bg-purple-200 rounded-lg overflow-hidden">
      <div class="p-3">
        <button @click="closeNotification()" class="float-right">
          <Icon name="ion:close-round" />
        </button>
        <h3 class="font-semibold">{{ props.message }}</h3>
        <p>{{ props.content }}</p>
      </div>
      <div class="h-1 bg-purple-300" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  show: Boolean,
  message: String,
  content: String,
});

function closeNotification() {
  console.log(props.show);
}
</script>

<style>
.notification-enter-active,
.notification-leave-active {
  transition: transform 0.35s ease-in;
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
