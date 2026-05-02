<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">My Projects</h1>
      <button
        @click="showCreateModal = true"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 font-medium transition"
      >
        + New Project
      </button>
    </div>

    <!-- Loading -->
    <div v-if="projectsStore.loading" class="text-center text-gray-400 py-20">
      Loading projects...
    </div>

    <!-- Error -->
    <div v-else-if="projectsStore.error" class="text-center text-red-500 py-20">
      {{ projectsStore.error }}
    </div>

    <!-- Empty -->
    <div
      v-else-if="projectsStore.projects.length === 0"
      class="text-center text-gray-400 py-20"
    >
      No projects yet. Create your first one!
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projectsStore.projects"
        :key="project.id"
        @click="router.push(`/projects/${project.id}`)"
        class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border border-gray-100"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-2">
          {{ project.name }}
        </h2>
        <p class="text-gray-400 text-sm mb-4 line-clamp-2">
          {{ project.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-300">
            {{ new Date(project.createdAt).toLocaleDateString() }}
          </span>
          <span
            class="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-medium"
          >
            {{ project.taskCount ?? 0 }} tasks
          </span>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6">New Project</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Project Name</label
          >
          <input
            v-model="newProject.name"
            type="text"
            placeholder="My Awesome Project"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            v-model="newProject.description"
            placeholder="What is this project about?"
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition resize-none"
          />
        </div>

        <div
          v-if="createError"
          class="bg-red-50 text-red-500 rounded-lg p-3 mb-4 text-sm border border-red-200"
        >
          {{ createError }}
        </div>

        <div class="flex gap-3">
          <button
            @click="showCreateModal = false"
            class="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleCreateProject"
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
import { useRouter } from "vue-router";
import { useProjectsStore } from "@/stores/projects";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const router = useRouter();
const projectsStore = useProjectsStore();

const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref(null);
const newProject = ref({ name: "", description: "" });

onMounted(() => {
  projectsStore.fetchMyProjects();
});

async function handleCreateProject() {
  creating.value = true;
  createError.value = null;
  try {
    await projectsStore.createProject(newProject.value);
    showCreateModal.value = false;
    newProject.value = { name: "", description: "" };
  } catch (err) {
    createError.value =
      err.response?.data?.message || "Failed to create project.";
  } finally {
    creating.value = false;
  }
}
</script>
