<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
      <p class="text-gray-400 text-sm mt-1">
        View and update your profile information
      </p>
    </div>

    <!-- Loading -->
    <div v-if="userStore.loading" class="text-center text-gray-400 py-20">
      Loading profile...
    </div>

    <div v-else class="max-w-lg">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <!-- Avatar -->
        <div class="flex items-center gap-4 mb-8">
          <div
            class="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold"
          >
            {{ initials }}
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              {{ userStore.profile?.firstName }}
              {{ userStore.profile?.lastName }}
            </h2>
            <p class="text-gray-400 text-sm">{{ userStore.profile?.email }}</p>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="editing">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >First Name</label
            >
            <input
              v-model="form.firstName"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Last Name</label
            >
            <input
              v-model="form.lastName"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
            />
          </div>

          <div
            v-if="error"
            class="bg-red-50 text-red-500 rounded-lg p-3 mb-4 text-sm border border-red-200"
          >
            {{ error }}
          </div>

          <div
            v-if="success"
            class="bg-green-50 text-green-600 rounded-lg p-3 mb-4 text-sm border border-green-200"
          >
            Profile updated successfully!
          </div>

          <div class="flex gap-3">
            <button
              @click="editing = false"
              class="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              @click="handleUpdate"
              :disabled="userStore.loading"
              class="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 disabled:opacity-50 transition font-medium"
            >
              {{ userStore.loading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>

        <!-- View Mode -->
        <div v-else>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between py-3 border-b border-gray-100">
              <span class="text-sm text-gray-400">First Name</span>
              <span class="text-sm font-medium text-gray-800">{{
                userStore.profile?.firstName
              }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100">
              <span class="text-sm text-gray-400">Last Name</span>
              <span class="text-sm font-medium text-gray-800">{{
                userStore.profile?.lastName
              }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100">
              <span class="text-sm text-gray-400">Email</span>
              <span class="text-sm font-medium text-gray-800">{{
                userStore.profile?.email
              }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-sm text-gray-400">Member Since</span>
              <span class="text-sm font-medium text-gray-800">
                {{
                  userStore.profile?.createdAt
                    ? new Date(userStore.profile.createdAt).toLocaleDateString()
                    : ""
                }}
              </span>
            </div>
          </div>

          <button
            @click="startEditing"
            class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 transition font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const userStore = useUserStore();

const editing = ref(false);
const error = ref(null);
const success = ref(false);
const form = ref({ firstName: "", lastName: "" });

const initials = computed(() => {
  const p = userStore.profile;
  if (!p) return "?";
  return `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase();
});

onMounted(() => {
  userStore.fetchMyProfile();
});

function startEditing() {
  form.value = {
    firstName: userStore.profile?.firstName ?? "",
    lastName: userStore.profile?.lastName ?? "",
  };
  editing.value = true;
  success.value = false;
  error.value = null;
}

async function handleUpdate() {
  error.value = null;
  success.value = false;
  try {
    await userStore.updateProfile(form.value);
    editing.value = false;
    success.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to update profile.";
  }
}
</script>
