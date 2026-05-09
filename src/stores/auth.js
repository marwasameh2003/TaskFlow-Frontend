import { defineStore } from "pinia";
import { authApi } from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, firstName, lastName, email } =
        response.data.data;
      this.token = accessToken;
      this.refreshToken = refreshToken;
      this.user = { firstName, lastName, email };
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

// state is the data that the store holds
// getters are computed properties based on the state
// actions are functions that change the state
