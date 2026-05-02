import api from "./axios";

export const projectsApi = {
  getMyProjects() {
    return api.get("/projects");
  },

  getById(id) {
    return api.get(`/projects/${id}`);
  },

  create(data) {
    return api.post("/projects", data);
  },

  archive(id) {
    return api.patch(`/projects/${id}/archive`);
  },
};
