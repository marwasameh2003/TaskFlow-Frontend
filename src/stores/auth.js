import { defineStore } from "pinia";
import { authApi } from "@/api/auth";

// decode JWT payload without a library
function parseJwt(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    pendingEmail: null,
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => {
      if (!state.token) return false;
      const payload = parseJwt(state.token);
      return (
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Admin"
      );
    },
  },

  actions: {
    async login(credentials) {
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, firstName, lastName, email } =
        response.data.data;
      this.token = accessToken;
      this.refreshToken = refreshToken;
      // decode id from token
      const payload = parseJwt(accessToken);
      this.user = { id: payload.sub, firstName, lastName, email };
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },

    async refresh() {
      const response = await authApi.refresh(this.refreshToken);
      const { accessToken, refreshToken } = response.data.data;
      this.token = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },

    async register(data) {
      await authApi.register(data);
      this.pendingEmail = data.email;
    },
    async verifyOtp(data) {
      const response = await authApi.verifyOtp(data);
      const { accessToken, refreshToken, firstName, lastName, email } =
        response.data.data;
      this.token = accessToken;
      this.refreshToken = refreshToken;
      const payload = parseJwt(accessToken);
      this.user = { id: payload.sub, firstName, lastName, email };
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});
