import { defineStore } from "pinia";
import { authApi } from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await authApi.login(credentials);
      const token = response.data.data;
      this.token = token;
      localStorage.setItem("token", token);
    },

    async register(data) {
      await authApi.register(data);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
  },
});

// state is the data that the store holds
// getters are computed properties based on the state
// actions are functions that change the state
