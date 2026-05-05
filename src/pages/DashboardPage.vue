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
    <div
      v-if="projectsStore.loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <SkeletonCard v-for="n in 6" :key="n" />
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
        class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border border-gray-100 relative group"
      >
        <!-- Archive button -->
        <button
          @click.stop="handleArchiveProject(project.id)"
          class="absolute top-4 right-4 text-xs text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
        >
          Archive
        </button>

        <div @click="router.push(`/projects/${project.id}`)">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Archived Projects -->
    <div class="mt-12">
      <button
        @click="toggleArchived"
        class="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition text-sm font-medium mb-4"
      >
        <span>{{ showArchived ? "▼" : "►" }}</span>
        Archived Projects ({{ projectsStore.archivedProjects.length }})
      </button>

      <div v-if="showArchived">
        <!-- Loading -->
        <div
          v-if="projectsStore.loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <SkeletonCard v-for="n in 3" :key="n" />
        </div>

        <!-- Empty -->
        <div
          v-else-if="projectsStore.archivedProjects.length === 0"
          class="text-center text-gray-400 py-10"
        >
          No archived projects.
        </div>

        <!-- Archived Grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="project in projectsStore.archivedProjects"
            :key="project.id"
            class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-60"
          >
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ project.name }}
              </h2>
              <span
                class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full"
                >Archived</span
              >
            </div>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2">
              {{ project.description }}
            </p>
            <span class="text-xs text-gray-300">
              {{ new Date(project.createdAt).toLocaleDateString() }}
            </span>
          </div>
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
import { useToast } from "@/composables/useToast";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";

const router = useRouter();
const projectsStore = useProjectsStore();
const { success, error } = useToast();

const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref(null);
const newProject = ref({ name: "", description: "" });

onMounted(() => {
  projectsStore.fetchMyProjects();
  projectsStore.fetchArchivedProjects();
});

async function handleCreateProject() {
  creating.value = true;
  createError.value = null;
  try {
    await projectsStore.createProject(newProject.value);
    showCreateModal.value = false;
    newProject.value = { name: "", description: "" };
    success("Project created successfully!");
  } catch (err) {
    error(err.response?.data?.message || "Failed to create project.");
  } finally {
    creating.value = false;
  }
}
async function handleArchiveProject(id) {
  if (!confirm("Are you sure you want to archive this project?")) return;
  try {
    await projectsStore.archiveProject(id);
    success("Project archived!");
  } catch (err) {
    error(err.response?.data?.message || "Failed to archive project.");
  }
}
const showArchived = ref(false);

async function toggleArchived() {
  showArchived.value = !showArchived.value;
  if (showArchived.value && projectsStore.archivedProjects.length === 0) {
    await projectsStore.fetchArchivedProjects();
  }
}
</script>
