<template>
  <header class="sticky top-0 flex items-center gap-5 px-3 py-2 bg-indigo-300">
    <h1 class="text-lg">Lightboard</h1>
    <nav class="flex justify-between w-full">
      <div>
        <NuxtLink to="/" class="mx-3">Home</NuxtLink>
        <NuxtLink to="/board/" class="mx-3">Leader Board</NuxtLink>
      </div>
      <NuxtLink to="/admin/" class="mx-3">Admin</NuxtLink>
    </nav>
  </header>
</template>
