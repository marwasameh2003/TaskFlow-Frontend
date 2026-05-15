import api from "./axios";

export const authApi = {
  login(credentials) {
    return api.post("/auth/login", credentials);
  },

  register(data) {
    return api.post("/auth/register", data);
  },
  verifyOtp(data) {
    return api.post("/auth/verify-otp", data);
  },
  refresh(refreshToken) {
    return api.post("/auth/refresh", { refreshToken });
  },
};
