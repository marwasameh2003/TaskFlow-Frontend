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
            <!-- Priority badge -->
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

          <!-- Status badge -->
          <span
            :class="statusClass(task.status)"
            class="text-xs px-3 py-1 rounded-full font-medium"
          >
            {{ statusLabel(task.status) }}
          </span>
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
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
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
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SkeletonTask from "@/components/skeletonTask.vue";

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const { success, error } = useToast();

const showCreateModal = ref(false);
const creating = ref(false);
const newTask = ref({
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
  projectId: route.params.id,
});

onMounted(() => {
  projectsStore.fetchProjectById(route.params.id);
  tasksStore.fetchByProject(route.params.id);
});

async function handleCreateTask() {
  creating.value = true;
  try {
    await tasksStore.createTask(newTask.value);
    showCreateModal.value = false;
    newTask.value = {
      title: "",
      description: "",
      priority: "Medium",
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
</script>
