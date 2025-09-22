import axios, { AxiosInstance } from 'axios';
import { TickTickAuth } from './ticktick-auth.js';
import {
  Task,
  Project,
  TaskFilter,
  APIResponse,
} from '../types/ticktick.js';
import { ITickTickAPI } from '../types/api-interface.js';

export class TickTickAPI implements ITickTickAPI {
  private api: AxiosInstance;
  private auth: TickTickAuth;
  private baseURL = 'https://api.ticktick.com/open/v1';

  constructor(auth: TickTickAuth) {
    this.auth = auth;
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    // Add request interceptor to include auth headers
    this.api.interceptors.request.use((config) => {
      const headers = this.auth.getAuthHeaders();
      Object.assign(config.headers, headers);
      return config;
    });

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.auth.refreshAccessToken();
            // Retry the original request
            const originalRequest = error.config;
            const headers = this.auth.getAuthHeaders();
            Object.assign(originalRequest.headers, headers);
            return this.api.request(originalRequest);
          } catch (refreshError) {
            throw new Error('Authentication failed. Please re-authenticate.');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Task Management Methods

  /**
   * Get all tasks with optional filtering
   */
  async getTasks(filter: any = {}): Promise<Task[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter.projectId) params.append('projectId', filter.projectId);
      if (filter.completed !== undefined) params.append('completed', filter.completed.toString());
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.limit) params.append('limit', filter.limit.toString());
      if (filter.offset) params.append('offset', filter.offset.toString());

      const response = await this.api.get(`/task?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error}`);
    }
  }

  /**
   * Get task by ID
   */
  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await this.api.get(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get task: ${error}`);
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: any): Promise<Task> {
    try {
      const response = await this.api.post('/task', taskData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create task: ${error}`);
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(taskData: any): Promise<Task> {
    try {
      const { id, ...updateData } = taskData;
      const response = await this.api.post(`/task/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update task: ${error}`);
    }
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<Task> {
    try {
      const response = await this.api.post(`/task/${taskId}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to complete task: ${error}`);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.api.delete(`/task/${taskId}`);
    } catch (error) {
      throw new Error(`Failed to delete task: ${error}`);
    }
  }

  // Project Management Methods

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    try {
      const response = await this.api.get('/project');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get projects: ${error}`);
    }
  }

  /**
   * Get project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    try {
      const response = await this.api.get(`/project/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get project: ${error}`);
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData: any): Promise<Project> {
    try {
      const response = await this.api.post('/project', projectData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create project: ${error}`);
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(projectId: string, projectData: any): Promise<Project> {
    try {
      const response = await this.api.post(`/project/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update project: ${error}`);
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      await this.api.delete(`/project/${projectId}`);
    } catch (error) {
      throw new Error(`Failed to delete project: ${error}`);
    }
  }

  // Convenience Methods

  /**
   * Get today's tasks
   */
  async getTodayTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getTasks({
      startDate: today,
      endDate: today,
      completed: false,
    });
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getTasks({
      endDate: today,
      completed: false,
    });
  }

  /**
   * Search tasks by title or content
   */
  async searchTasks(query: string, limit?: number): Promise<Task[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (limit) params.append('limit', limit.toString());

      const response = await this.api.get(`/task/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search tasks: ${error}`);
    }
  }
}