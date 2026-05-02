import { defineStore } from "pinia";
import { usersApi } from "@/api/users";

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMyProfile() {
      this.loading = true;
      this.error = null;
      try {
        const response = await usersApi.getMyProfile();
        this.profile = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load profile.";
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await usersApi.updateProfile(data);
        this.profile = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to update profile.";
      } finally {
        this.loading = false;
      }
    },
  },
});
