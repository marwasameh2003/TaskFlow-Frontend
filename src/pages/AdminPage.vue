<template>
  <DashboardLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Admin Panel</h1>
      <p class="text-gray-400 text-sm mt-1">Manage all users in the system</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-400 py-20">
      Loading users...
    </div>

    <!-- Users Table -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Name
            </th>
            <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Email
            </th>
            <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Role
            </th>
            <th class="text-left px-6 py-4 text-sm font-medium text-gray-500">
              Joined
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ user.firstName[0] }}{{ user.lastName[0] }}
                </div>
                <span class="text-sm font-medium text-gray-800">
                  {{ user.firstName }} {{ user.lastName }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span
                :class="
                  user.role === 'Admin'
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-500'
                "
                class="text-xs px-2 py-1 rounded-full font-medium"
              >
                {{ user.role ?? "Member" }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-400">
              {{ new Date(user.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usersApi } from "@/api/users";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const users = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await usersApi.getAllUsers();
    users.value = response.data.data;
  } finally {
    loading.value = false;
  }
});
</script>
