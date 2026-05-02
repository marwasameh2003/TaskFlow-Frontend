<template>
  <AuthLayout>
    <form @submit.prevent="handleRegister">
      <div
        v-if="error"
        class="bg-red-50 text-red-500 rounded-lg p-3 mb-4 text-sm border border-red-200"
      >
        {{ error }}
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >First Name</label
        >
        <input
          v-model="form.firstName"
          type="text"
          placeholder="Marwa"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Last Name</label
        >
        <input
          v-model="form.lastName"
          type="text"
          placeholder="Sameh"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <input
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 disabled:opacity-50 font-semibold transition"
      >
        {{ loading ? "Creating account..." : "Create Account" }}
      </button>

      <p class="text-center text-sm text-gray-400 mt-6">
        Already have an account?
        <RouterLink
          to="/login"
          class="text-primary-600 hover:text-primary-500 font-medium"
        >
          Sign In
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});
const loading = ref(false);
const error = ref(null);

async function handleRegister() {
  loading.value = true;
  error.value = null;
  try {
    await authStore.register(form.value);
    router.push("/login");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
