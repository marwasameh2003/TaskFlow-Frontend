<template>
  <AuthLayout>
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Reset Password</h2>
      <p class="text-gray-400 text-sm mt-1">
        Enter your reset code and new password
      </p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div
        v-if="error"
        class="bg-red-50 text-red-500 rounded-lg p-3 mb-4 text-sm border border-red-200"
      >
        {{ error }}
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

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Reset Code</label
        >
        <input
          v-model="form.code"
          type="text"
          placeholder="Enter 6-digit code"
          maxlength="6"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition text-center text-2xl tracking-widest font-bold"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >New Password</label
        >
        <input
          v-model="form.newPassword"
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
        {{ loading ? "Resetting..." : "Reset Password" }}
      </button>

      <p class="text-center text-sm text-gray-400 mt-6">
        <RouterLink
          to="/login"
          class="text-primary-600 hover:text-primary-500 font-medium"
        >
          Back to Sign In
        </RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authApi } from "@/api/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = useRouter();

const form = ref({ email: "", code: "", newPassword: "" });
const loading = ref(false);
const error = ref(null);

async function handleSubmit() {
  loading.value = true;
  error.value = null;
  try {
    await authApi.resetPassword(form.value);
    router.push("/login");
  } catch (err) {
    error.value = err.response?.data?.message || "Invalid or expired code.";
  } finally {
    loading.value = false;
  }
}
</script>
