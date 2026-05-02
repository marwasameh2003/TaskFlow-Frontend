import api from "./axios";

export const usersApi = {
  getMyProfile() {
    return api.get("/users/me");
  },

  updateProfile(data) {
    return api.put("/users/me", data);
  },
};
