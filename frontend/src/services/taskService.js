import api from './api';

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  getTasksByProject: async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  getAssignedTasks: async () => {
    const response = await api.get('/tasks/assigned');
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  assignTask: async (id, assigneeId) => {
    const response = await api.put(`/tasks/${id}/assign`, { assigneeId });
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.put(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
