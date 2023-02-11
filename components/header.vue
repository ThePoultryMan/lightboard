<template>
  <div class="flex items-center gap-5 px-3 py-2 bg-indigo-300">
    <h1 class="text-lg">Lightboard</h1>
    <nav class="flex justify-between w-full">
      <div>
        <NuxtLink to="/" class="mx-3">Home</NuxtLink>
        <NuxtLink to="/board">Board</NuxtLink>
      </div>
      <NuxtLink to="/admin">Admin</NuxtLink>
    </nav>
  </div>
</template>
