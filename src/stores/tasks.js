import { defineStore } from "pinia";
import { tasksApi } from "@/api/tasks";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchByProject(projectId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tasksApi.getByProject(projectId);
        console.log(response.data); // add this
        this.tasks = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load tasks.";
      } finally {
        this.loading = false;
      }
    },

    async createTask(data) {
      const response = await tasksApi.create(data);
      this.tasks.push(response.data.data);
    },

    async updateTaskStatus(id, status) {
      await tasksApi.updateStatus(id, status);
      const task = this.tasks.find((t) => t.id === id);
      if (task) task.status = status;
    },

    async deleteTask(id) {
      await tasksApi.delete(id);
      this.tasks = this.tasks.filter((t) => t.id !== id);
    },
  },
});
