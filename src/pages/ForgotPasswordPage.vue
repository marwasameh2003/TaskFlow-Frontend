<template>
  <AuthLayout>
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Forgot Password</h2>
      <p class="text-gray-400 text-sm mt-1">
        Enter your email and we'll send you a reset code
      </p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div
        v-if="success"
        class="bg-green-50 text-green-600 rounded-lg p-3 mb-4 text-sm border border-green-200"
      >
        Reset code sent! Check your email.
      </div>

      <div
        v-if="error"
        class="bg-red-50 text-red-500 rounded-lg p-3 mb-4 text-sm border border-red-200"
      >
        {{ error }}
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 disabled:opacity-50 font-semibold transition"
      >
        {{ loading ? "Sending..." : "Send Reset Code" }}
      </button>

      <div class="text-center mt-6 space-y-2">
        <p class="text-sm text-gray-400">
          Remember your password?
          <RouterLink
            to="/login"
            class="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign In
          </RouterLink>
        </p>
        <p class="text-sm text-gray-400">
          Already have a code?
          <RouterLink
            to="/reset-password"
            class="text-primary-600 hover:text-primary-500 font-medium"
          >
            Reset Password
          </RouterLink>
        </p>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { authApi } from "@/api/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";

const email = ref("");
const loading = ref(false);
const error = ref(null);
const success = ref(false);

async function handleSubmit() {
  loading.value = true;
  error.value = null;
  success.value = false;
  try {
    await authApi.forgotPassword(email.value);
    success.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>
