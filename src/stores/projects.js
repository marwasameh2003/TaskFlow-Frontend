import { defineStore } from "pinia";
import { projectsApi } from "@/api/projects";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
    archivedProjects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMyProjects() {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsApi.getMyProjects();
        this.projects = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load projects.";
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsApi.getById(id);
        this.currentProject = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load project.";
      } finally {
        this.loading = false;
      }
    },

    async createProject(data) {
      const response = await projectsApi.create(data);
      this.projects.push(response.data.data);
    },

    async archiveProject(id) {
      await projectsApi.archive(id);
      this.projects = this.projects.filter((p) => p.id !== id);
    },
    async fetchArchivedProjects() {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsApi.getArchived();
        this.archivedProjects = response.data.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Failed to load archived projects.";
      } finally {
        this.loading = false;
      }
    },
  },
});
