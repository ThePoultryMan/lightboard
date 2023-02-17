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
      <div class="progress-bar h-1 bg-purple-300" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  show: Boolean,
  message: String,
  content: String,
});
const emit = defineEmits(["close"]);

function closeNotification() {
  emit("close");
}
</script>

<style>
.notification-enter-active,
.notification-leave-active {
  transition: transform 0.27s ease-in-out;
}

.notification-enter-from,
.notification-leave-to {
  transform: translateX(100%);
}

.notification-enter-to,
.notification-leave-from {
  transform: translateX(0%);
}

@keyframes width-max {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.progress-bar {
  width: 0%;
  animation: width-max 3s linear 0.35s forwards;
}
</style>
