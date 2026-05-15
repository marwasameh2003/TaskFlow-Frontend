<template>
  <AuthLayout>
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Verify your email</h2>
      <p class="text-gray-400 text-sm mt-1">
        We sent a 6-digit code to
        <span class="text-primary-600 font-medium">{{
          authStore.pendingEmail
        }}</span>
      </p>
    </div>

    <form @submit.prevent="handleVerify">
      <div
        v-if="error"
        class="bg-red-50 text-red-500 rounded-lg p-3 mb-4 text-sm border border-red-200"
      >
        {{ error }}
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Verification Code</label
        >
        <input
          v-model="code"
          type="text"
          placeholder="Enter 6-digit code"
          maxlength="6"
          class="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 placeholder-gray-300 transition text-center text-2xl tracking-widest font-bold"
        />
      </div>

      <button
        type="submit"
        :disabled="loading || code.length !== 6"
        class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 disabled:opacity-50 font-semibold transition"
      >
        {{ loading ? "Verifying..." : "Verify Email" }}
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

const code = ref("");
const loading = ref(false);
const error = ref(null);

async function handleVerify() {
  loading.value = true;
  error.value = null;
  try {
    await authStore.verifyOtp({
      email: authStore.pendingEmail,
      code: code.value,
    });
    router.push("/dashboard");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Invalid OTP. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
