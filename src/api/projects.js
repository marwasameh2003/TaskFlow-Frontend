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
  getArchived() {
    return api.get("/projects/archived");
  },
  getMembers(projectId) {
    return api.get(`/projects/${projectId}/members`);
  },

  addMember(projectId, data) {
    return api.post(`/projects/${projectId}/members`, data);
  },

  removeMember(projectId, userId) {
    return api.delete(`/projects/${projectId}/members/${userId}`);
  },
};
