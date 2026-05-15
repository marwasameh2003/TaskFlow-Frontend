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
    const statusMap = {
      ToDo: 1,
      InProgress: 2,
      Done: 3,
      Cancelled: 4,
    };
    return api.patch(`/tasks/${id}/status`, { newStatus: statusMap[status] });
  },

  delete(id) {
    return api.delete(`/tasks/${id}`);
  },

  getActivity(id) {
    return api.get(`/tasks/${id}/activity`);
  },
};
