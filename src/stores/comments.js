import { defineStore } from 'pinia'
import { commentsApi } from '@/api/comments'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchByTask(taskId) {
      this.loading = true
      this.error = null
      try {
        const response = await commentsApi.getByTask(taskId)
        this.comments = response.data.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load comments.'
      } finally {
        this.loading = false
      }
    },

    async addComment(data) {
      const response = await commentsApi.add(data)
      this.comments.push(response.data.data)
    },

    async deleteComment(id) {
      await commentsApi.delete(id)
      this.comments = this.comments.filter(c => c.id !== id)
    }
  }
})