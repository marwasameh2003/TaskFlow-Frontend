<template>
  <div class="min-h-screen bg-gray-100">
    <ToastNotification ref="toastRef" />

    <nav class="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <RouterLink to="/dashboard" class="text-xl font-bold text-primary-600">
        TaskFlow
      </RouterLink>
      <div class="flex items-center gap-4">
        <!-- Admin link — only visible to admins -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin"
          class="text-xs bg-primary-600 text-white px-3 py-1 rounded-full hover:bg-primary-500 transition font-medium"
        >
          Admin Panel
        </RouterLink>

        <RouterLink
          to="/profile"
          class="text-gray-500 hover:text-primary-600 transition"
        >
          Profile
        </RouterLink>
        <button
          @click="handleLogout"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition"
        >
          Logout
        </button>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
import ToastNotification from "@/components/ToastNotification.vue";

const authStore = useAuthStore();
const router = useRouter();
const { toastRef } = useToast();

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>
