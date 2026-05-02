import api from "./axios";

export const tasksApi = {
  getByProject(projectId) {
    return api.get(`/tasks/project/${projectId}`);
  },
  getById(id) {
    return api.get(`/tasks/${id}`);
  },

  getFiltered(params) {
    return api.get("/tasks", { params });
  },

  create(data) {
    return api.post("/tasks", data);
  },

  updateStatus(id, status) {
    return api.patch(`/tasks/${id}/status`, { status });
  },

  delete(id) {
    return api.delete(`/tasks/${id}`);
  },
};
