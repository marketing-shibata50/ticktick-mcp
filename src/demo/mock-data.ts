// Mock data for demo mode
import { Task, Project } from '../types/ticktick.js';
import { ITickTickAPI } from '../types/api-interface.js';

export const mockTasks: Task[] = [
  {
    id: 'demo-task-1',
    title: 'Complete MCP Server Documentation',
    content: 'Write comprehensive documentation for the TickTick MCP server',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    priority: 3,
    projectId: 'demo-project-1',
    status: 0,
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
  },
  {
    id: 'demo-task-2',
    title: 'Review Pull Requests',
    content: 'Review and merge pending pull requests',
    dueDate: new Date().toISOString(), // Today
    priority: 5,
    projectId: 'demo-project-1',
    status: 0,
    createdTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    modifiedTime: new Date().toISOString(),
  },
  {
    id: 'demo-task-3',
    title: 'Plan Weekly Meeting',
    content: 'Prepare agenda for weekly team meeting',
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday (overdue)
    priority: 1,
    projectId: 'demo-project-2',
    status: 0,
    createdTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    modifiedTime: new Date().toISOString(),
  },
  {
    id: 'demo-task-4',
    title: 'Update Website Content',
    content: 'Update the company website with latest product information',
    dueDate: new Date(Date.now() + 604800000).toISOString(), // Next week
    priority: 2,
    projectId: 'demo-project-2',
    status: 0,
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
  },
  {
    id: 'demo-task-5',
    title: 'Completed Task Example',
    content: 'This is an example of a completed task',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    priority: 3,
    projectId: 'demo-project-1',
    status: 1, // Completed
    createdTime: new Date(Date.now() - 172800000).toISOString(),
    modifiedTime: new Date().toISOString(),
    completedTime: new Date().toISOString(),
  },
];

export const mockProjects: Project[] = [
  {
    id: 'demo-project-1',
    name: 'Development Tasks',
    color: '#3498db',
    sortOrder: 1,
    modifiedTime: new Date().toISOString(),
    closed: false,
    kind: 'project',
  },
  {
    id: 'demo-project-2',
    name: 'Marketing & Content',
    color: '#e74c3c',
    sortOrder: 2,
    modifiedTime: new Date().toISOString(),
    closed: false,
    kind: 'project',
  },
  {
    id: 'demo-project-3',
    name: 'Personal',
    color: '#2ecc71',
    sortOrder: 3,
    modifiedTime: new Date().toISOString(),
    closed: false,
    kind: 'project',
  },
];

// Helper functions for demo mode
export class MockTickTickAPI implements ITickTickAPI {
  private tasks: Task[] = [...mockTasks];
  private projects: Project[] = [...mockProjects];

  async getTasks(filter: any = {}): Promise<Task[]> {
    let filteredTasks = [...this.tasks];

    if (filter.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === filter.projectId);
    }

    if (filter.completed !== undefined) {
      filteredTasks = filteredTasks.filter(task => 
        filter.completed ? task.status === 1 : task.status === 0
      );
    }

    if (filter.startDate && filter.endDate) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= new Date(filter.startDate) && taskDate <= new Date(filter.endDate);
      });
    }

    if (filter.limit) {
      filteredTasks = filteredTasks.slice(0, filter.limit);
    }

    return filteredTasks;
  }

  async getTask(taskId: string): Promise<Task> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    return task;
  }

  async createTask(taskData: any): Promise<Task> {
    const newTask: Task = {
      id: `demo-task-${Date.now()}`,
      title: taskData.title,
      content: taskData.content || '',
      dueDate: taskData.dueDate,
      priority: taskData.priority || 0,
      projectId: taskData.projectId || 'demo-project-1',
      status: 0,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      tags: taskData.tags || [],
    };

    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(taskData: any): Promise<Task> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskData.id);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${taskData.id}`);
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...taskData,
      modifiedTime: new Date().toISOString(),
    };

    return this.tasks[taskIndex];
  }

  async completeTask(taskId: string): Promise<Task> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      status: 1,
      completedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    return this.tasks[taskIndex];
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    this.tasks.splice(taskIndex, 1);
  }

  async getProjects(): Promise<Project[]> {
    return [...this.projects];
  }

  async getProject(projectId: string): Promise<Project> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }
    return project;
  }

  async createProject(projectData: any): Promise<Project> {
    const newProject: Project = {
      id: `demo-project-${Date.now()}`,
      name: projectData.name,
      color: projectData.color || '#3498db',
      sortOrder: this.projects.length + 1,
      modifiedTime: new Date().toISOString(),
      closed: false,
      kind: 'project',
    };

    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(projectId: string, projectData: any): Promise<Project> {
    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project not found: ${projectId}`);
    }

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...projectData,
      modifiedTime: new Date().toISOString(),
    };

    return this.projects[projectIndex];
  }

  async deleteProject(projectId: string): Promise<void> {
    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project not found: ${projectId}`);
    }

    this.projects.splice(projectIndex, 1);
  }

  // Convenience methods
  async getTodayTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getTasks({
      startDate: today,
      endDate: today,
      completed: false,
    });
  }

  async getOverdueTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task => {
      if (!task.dueDate || task.status === 1) return false;
      return new Date(task.dueDate) < new Date(today);
    });
  }

  async searchTasks(query: string, limit?: number): Promise<Task[]> {
    const lowercaseQuery = query.toLowerCase();
    let results = this.tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      (task.content && task.content.toLowerCase().includes(lowercaseQuery))
    );

    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  }
}