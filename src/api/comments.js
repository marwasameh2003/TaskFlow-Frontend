import api from './axios'

export const commentsApi = {
  getByTask(taskId) {
    return api.get(`/comments/task/${taskId}`)
  },

  add(data) {
    return api.post('/comments', data)
  },

  delete(id) {
    return api.delete(`/comments/${id}`)
  }
}