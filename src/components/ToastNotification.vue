<template>
  <div class="fixed top-6 right-6 z-50 flex flex-col gap-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'px-5 py-4 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 transition-all',
        toast.type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white',
      ]"
    >
      <span>{{ toast.type === "success" ? "✓" : "✕" }}</span>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const toasts = ref([]);

function show(message, type = "success") {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000);
}

defineExpose({ show });
</script>
