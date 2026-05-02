<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-700 tracking-tight">TaskFlow</h1>
        <p class="text-gray-400 mt-2 text-sm">Manage your projects and tasks</p>
      </div>
      <slot />
    </div>
  </div>
</template>