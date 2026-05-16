<template>
  <DashboardLayout>
    <!-- Loading -->
    <div v-if="tasksStore.loading" class="space-y-3">
      <SkeletonTask v-for="n in 5" :key="n" />
    </div>
    <template v-else-if="projectsStore.currentProject">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <button
            @click="router.push('/dashboard')"
            class="text-sm text-gray-400 hover:text-primary-600 transition mb-1"
          >
            ← Back to Dashboard
          </button>
          <h1 class="text-2xl font-bold text-gray-800">
            {{ projectsStore.currentProject.name }}
          </h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ projectsStore.currentProject.description }}
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 font-medium transition"
        >
          + New Task
        </button>
      </div>

      <!-- Loading tasks -->
      <div v-if="tasksStore.loading" class="text-center text-gray-400 py-20">
        Loading tasks...
      </div>

      <!-- Empty tasks -->
      <div
        v-else-if="tasksStore.tasks.length === 0"
        class="text-center text-gray-400 py-20"
      >
        No tasks yet. Create your first one!
      </div>

      <!-- Tasks List -->
      <div v-else class="space-y-3">
        <div
          v-for="task in tasksStore.tasks"
          :key="task.id"
          class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          @click="router.push(`/tasks/${task.id}`)"
        >
          <div class="flex items-center gap-4">
            <span
              :class="priorityClass(task.priority)"
              class="text-xs px-2 py-1 rounded-full font-medium"
            >
              {{ priorityLabel(task.priority) }}
            </span>
            <div>
              <h3 class="font-medium text-gray-800">{{ task.title }}</h3>
              <p class="text-sm text-gray-400">{{ task.description }}</p>
            </div>
          </div>
          <span
            :class="statusClass(task.status)"
            class="text-xs px-3 py-1 rounded-full font-medium"
          >
            {{ statusLabel(task.status) }}
          </span>
        </div>
      </div>

      <!-- Members Section -->
      <div class="mt-8">
        <button
          @click="showMembersSection = !showMembersSection"
          class="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition text-sm font-medium mb-4"
        >
          <span>{{ showMembersSection ? "▼" : "►" }}</span>
          Team Members ({{ members.length }})
        </button>

        <div v-if="showMembersSection">
          <div
            class="flex justify-end mb-4"
            v-if="currentUserRole === 'Owner' || currentUserRole === 'Admin'"
          >
            <button
              @click="showAddMemberModal = true"
              class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 text-sm font-medium transition"
            >
              + Add Member
            </button>
          </div>

          <div v-if="membersLoading" class="text-center text-gray-400 py-4">
            Loading members...
          </div>

          <div
            v-else
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              v-for="member in members"
              :key="member.id"
              class="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold"
                >
                  {{ member.fullName[0] }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">
                    {{ member.fullName }}
                  </p>
                  <p class="text-xs text-gray-400">{{ member.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  :class="{
                    'bg-primary-50 text-primary-700': member.role === 'Owner',
                    'bg-blue-50 text-blue-600': member.role === 'Admin',
                    'bg-gray-100 text-gray-500': member.role === 'Member',
                  }"
                  class="text-xs px-2 py-1 rounded-full font-medium"
                >
                  {{ member.role }}
                </span>
                <button
                  v-if="
                    (currentUserRole === 'Owner' ||
                      currentUserRole === 'Admin') &&
                    member.role !== 'Owner'
                  "
                  @click="handleRemoveMember(member.userId)"
                  class="text-red-400 hover:text-red-600 text-xs transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Member Modal -->
      <div
        v-if="showAddMemberModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Add Team Member</h2>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              v-model="newMember.email"
              type="email"
              placeholder="member@example.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Role</label
            >
            <select
              v-model="newMember.role"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
            >
              <option value="Member">Member</option>
              <option value="Admin" v-if="currentUserRole === 'Owner'">
                Admin
              </option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              @click="showAddMemberModal = false"
              class="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              @click="handleAddMember"
              :disabled="addingMember"
              class="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 disabled:opacity-50 transition font-medium"
            >
              {{ addingMember ? "Adding..." : "Add Member" }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Create Task Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6">New Task</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Title</label
          >
          <input
            v-model="newTask.title"
            type="text"
            placeholder="Task title"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            v-model="newTask.description"
            placeholder="Task description"
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition resize-none"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Priority</label
          >
          <select
            v-model="newTask.priority"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
          >
            <option :value="1">Low</option>
            <option :value="2">Medium</option>
            <option :value="3">High</option>
            <option :value="4">Critical</option>
          </select>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Due Date</label
          >
          <input
            v-model="newTask.dueDate"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="showCreateModal = false"
            class="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleCreateTask"
            :disabled="creating"
            class="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-500 disabled:opacity-50 transition font-medium"
          >
            {{ creating ? "Creating..." : "Create" }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectsStore } from "@/stores/projects";
import { useTasksStore } from "@/stores/tasks";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth";
import { projectsApi } from "@/api/projects";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SkeletonTask from "@/components/SkeletonTask.vue";

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const authStore = useAuthStore();
const { success, error } = useToast();

const showCreateModal = ref(false);
const creating = ref(false);
const newTask = ref({
  title: "",
  description: "",
  priority: 2,
  dueDate: "",
  projectId: route.params.id,
});

const members = ref([]);
const membersLoading = ref(false);
const showMembersSection = ref(false);
const showAddMemberModal = ref(false);
const newMember = ref({ email: "", role: "Member" });
const addingMember = ref(false);
const currentUserRole = ref(null);

onMounted(() => {
  projectsStore.fetchProjectById(route.params.id);
  tasksStore.fetchByProject(route.params.id);
  fetchMembers();
});

async function fetchMembers() {
  membersLoading.value = true;
  try {
    const response = await projectsApi.getMembers(route.params.id);
    members.value = response.data.data;
    // get current user id from token
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      const currentUserId = payload.sub;
      const me = members.value.find((m) => m.userId === currentUserId);
      currentUserRole.value = me?.role ?? null;
    }
  } finally {
    membersLoading.value = false;
  }
}

async function handleAddMember() {
  addingMember.value = true;
  try {
    await projectsApi.addMember(route.params.id, newMember.value);
    await fetchMembers();
    showAddMemberModal.value = false;
    newMember.value = { email: "", role: "Member" };
    success("Member added successfully!");
  } catch (err) {
    error(err.response?.data?.message || "Failed to add member.");
  } finally {
    addingMember.value = false;
  }
}

async function handleRemoveMember(userId) {
  if (!confirm("Are you sure you want to remove this member?")) return;
  try {
    await projectsApi.removeMember(route.params.id, userId);
    await fetchMembers();
    success("Member removed!");
  } catch (err) {
    error(err.response?.data?.message || "Failed to remove member.");
  }
}

async function handleCreateTask() {
  creating.value = true;
  try {
    await tasksStore.createTask(newTask.value);
    showCreateModal.value = false;
    newTask.value = {
      title: "",
      description: "",
      priority: 2,
      dueDate: "",
      projectId: route.params.id,
    };
    success("Task created successfully!");
  } catch (err) {
    error(err.response?.data?.message || "Failed to create task.");
  } finally {
    creating.value = false;
  }
}

function priorityLabel(priority) {
  return (
    { 1: "Low", 2: "Medium", 3: "High", 4: "Critical" }[priority] ?? priority
  );
}

function statusLabel(status) {
  return status ?? "Unknown";
}

function priorityClass(priority) {
  return (
    {
      1: "bg-gray-100 text-gray-500",
      2: "bg-blue-50 text-blue-500",
      3: "bg-orange-50 text-orange-500",
      4: "bg-red-50 text-red-500",
      Low: "bg-gray-100 text-gray-500",
      Medium: "bg-blue-50 text-blue-500",
      High: "bg-orange-50 text-orange-500",
      Critical: "bg-red-50 text-red-500",
    }[priority] ?? "bg-gray-100 text-gray-500"
  );
}

function statusClass(status) {
  return (
    {
      ToDo: "bg-gray-100 text-gray-500",
      InProgress: "bg-primary-50 text-primary-600",
      Done: "bg-green-50 text-green-600",
      Cancelled: "bg-red-50 text-red-500",
    }[status] ?? "bg-gray-100 text-gray-500"
  );
}
</script>
