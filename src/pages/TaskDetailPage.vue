<template>
  <DashboardLayout>
    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-400 py-20">
      Loading task...
    </div>

    <template v-else-if="task">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="router.back()"
          class="text-sm text-gray-400 hover:text-primary-600 transition mb-2"
        >
          ← Back
        </button>
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ task.title }}</h1>
            <p class="text-gray-400 text-sm mt-1">{{ task.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              :class="priorityClass(task.priority)"
              class="text-xs px-2 py-1 rounded-full font-medium"
            >
              {{ task.priority }}
            </span>
            <span
              :class="statusClass(task.status)"
              class="text-xs px-3 py-1 rounded-full font-medium"
            >
              {{ task.status }}
            </span>
          </div>
        </div>

        <!-- Task Meta -->
        <div class="flex items-center gap-6 mt-4 text-sm text-gray-400">
          <span
            >Due:
            {{
              task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"
            }}</span
          >
          <span
            >Created: {{ new Date(task.createdAt).toLocaleDateString() }}</span
          >
        </div>

        <!-- Update Status -->
        <div class="mt-4 flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700"
            >Update Status:</label
          >
          <select
            v-model="selectedStatus"
            @change="handleUpdateStatus"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition"
          >
            <option value="ToDo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <!-- Delete Task Button -->
          <button
            @click="handleDeleteTask"
            class="ml-auto text-sm text-red-400 hover:text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Delete Task
          </button>
        </div>
      </div>
      <!-- Comments Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Comments</h2>

        <!-- Add Comment -->
        <div class="mb-6">
          <textarea
            v-model="newComment"
            placeholder="Add a comment..."
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition resize-none text-sm"
          />
          <button
            @click="handleAddComment"
            :disabled="addingComment || !newComment.trim()"
            class="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 disabled:opacity-50 transition text-sm font-medium"
          >
            {{ addingComment ? "Adding..." : "Add Comment" }}
          </button>
        </div>

        <!-- Comments List -->
        <div
          v-if="commentsStore.loading"
          class="text-center text-gray-400 py-4"
        >
          Loading comments...
        </div>

        <div
          v-else-if="commentsStore.comments.length === 0"
          class="text-center text-gray-400 py-4"
        >
          No comments yet.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="comment in commentsStore.comments"
            :key="comment.id"
            class="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-gray-700">{{
                  comment.authorName
                }}</span>
                <span class="text-xs text-gray-400">
                  {{ new Date(comment.createdAt).toLocaleDateString() }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ comment.content }}</p>
            </div>
            <button
              @click="handleDeleteComment(comment.id)"
              class="text-red-400 hover:text-red-600 text-xs transition ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Activity Log — OUTSIDE comments section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Activity Log</h2>

        <div v-if="activityLoading" class="text-center text-gray-400 py-4">
          Loading activity...
        </div>

        <div
          v-else-if="activities.length === 0"
          class="text-center text-gray-400 py-4"
        >
          No activity yet.
        </div>

        <div v-else class="relative">
          <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-100"></div>
          <div class="space-y-4">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="flex items-start gap-4 pl-8 relative"
            >
              <div
                class="absolute left-0 w-6 h-6 rounded-full bg-primary-100 border-2 border-primary-400 flex items-center justify-center"
              >
                <div class="w-2 h-2 rounded-full bg-primary-500"></div>
              </div>
              <div class="flex-1 pb-2">
                <p class="text-sm text-gray-700">{{ activity.description }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-400">{{
                    activity.userName
                  }}</span>
                  <span class="text-xs text-gray-300">·</span>
                  <span class="text-xs text-gray-400">
                    {{ new Date(activity.createdAt).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTasksStore } from "@/stores/tasks";
import { useCommentsStore } from "@/stores/comments";
import { useToast } from "@/composables/useToast";
import { tasksApi } from "@/api/tasks";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const router = useRouter();
const route = useRoute();
const tasksStore = useTasksStore();
const commentsStore = useCommentsStore();
const { success, error } = useToast();

const task = ref(null);
const loading = ref(false);
const selectedStatus = ref("");
const newComment = ref("");
const addingComment = ref(false);
const activities = ref([]);
const activityLoading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    // try store first, fall back to API if refreshed directly
    task.value = tasksStore.tasks.find((t) => t.id === route.params.id);
    if (!task.value) {
      const response = await tasksApi.getById(route.params.id);
      task.value = response.data.data;
    }
    selectedStatus.value = task.value.status;
    await commentsStore.fetchByTask(route.params.id);
    await fetchActivity();
  } finally {
    loading.value = false;
  }
});
async function fetchActivity() {
  activityLoading.value = true;
  try {
    const response = await tasksApi.getActivity(route.params.id);
    activities.value = response.data.data;
  } finally {
    activityLoading.value = false;
  }
}

async function handleUpdateStatus() {
  try {
    await tasksStore.updateTaskStatus(route.params.id, selectedStatus.value);
    task.value.status = selectedStatus.value;
    success("Status updated successfully!");
    await fetchActivity();
  } catch (err) {
    error(err.response?.data?.message || "Failed to update status.");
  }
}

async function handleAddComment() {
  addingComment.value = true;
  try {
    await commentsStore.addComment({
      taskItemId: route.params.id,
      content: newComment.value,
    });
    newComment.value = "";
    success("Comment added!");
    await fetchActivity();
  } catch (err) {
    error(err.response?.data?.message || "Failed to add comment.");
  } finally {
    addingComment.value = false;
  }
}

async function handleDeleteComment(id) {
  try {
    await commentsStore.deleteComment(id);
    success("Comment deleted!");
  } catch (err) {
    error(err.response?.data?.message || "Failed to delete comment.");
  }
}

async function handleDeleteTask() {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    await tasksStore.deleteTask(route.params.id);
    success("Task deleted!");
    router.back();
  } catch (err) {
    error(err.response?.data?.message || "Failed to delete task.");
  }
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
