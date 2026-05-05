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
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTasksStore } from "@/stores/tasks";
import { useCommentsStore } from "@/stores/comments";
import { useToast } from "@/composables/useToast";
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

onMounted(async () => {
  loading.value = true;
  try {
    task.value = tasksStore.tasks.find((t) => t.id === route.params.id);
    selectedStatus.value = task.value.status;
    await commentsStore.fetchByTask(route.params.id);
  } finally {
    loading.value = false;
  }
});

async function handleUpdateStatus() {
  try {
    await tasksStore.updateTaskStatus(route.params.id, selectedStatus.value);
    task.value.status = selectedStatus.value;
    success("Status updated successfully!");
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
</script>
