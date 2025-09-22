import { Task, Project } from './ticktick.js';

export interface ITickTickAPI {
  // Task operations
  getTasks(filter?: any): Promise<Task[]>;
  getTask(taskId: string): Promise<Task>;
  createTask(task: any): Promise<Task>;
  updateTask(task: any): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  completeTask(taskId: string): Promise<Task>;
  searchTasks(query: string, limit?: number): Promise<Task[]>;
  getTodayTasks(): Promise<Task[]>;
  getOverdueTasks(): Promise<Task[]>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(projectId: string): Promise<Project>;
  createProject(project: any): Promise<Project>;
  updateProject(projectId: string, projectData: any): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
}