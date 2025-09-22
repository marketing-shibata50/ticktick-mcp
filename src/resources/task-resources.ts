import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { ITickTickAPI } from '../types/api-interface.js';

export class TaskResources {
  constructor(private api: ITickTickAPI) {}

  getResources(): Resource[] {
    return [
      {
        uri: 'ticktick://tasks/today',
        name: "Today's Tasks",
        description: 'All tasks scheduled for today',
        mimeType: 'application/json',
      },
      {
        uri: 'ticktick://tasks/overdue',
        name: 'Overdue Tasks',
        description: 'All tasks that are past their due date',
        mimeType: 'application/json',
      },
      {
        uri: 'ticktick://tasks/upcoming',
        name: 'Upcoming Tasks',
        description: 'Tasks scheduled for the next 7 days',
        mimeType: 'application/json',
      },
      {
        uri: 'ticktick://tasks/all',
        name: 'All Tasks',
        description: 'All tasks in the account',
        mimeType: 'application/json',
      },
      {
        uri: 'ticktick://tasks/completed',
        name: 'Completed Tasks',
        description: 'All completed tasks',
        mimeType: 'application/json',
      },
      {
        uri: 'ticktick://tasks/incomplete',
        name: 'Incomplete Tasks',
        description: 'All incomplete tasks',
        mimeType: 'application/json',
      },
      {
        uri: 'ticktick://projects/all',
        name: 'All Projects',
        description: 'All projects in the account',
        mimeType: 'application/json',
      },
    ];
  }

  async getResourceContent(uri: string): Promise<any> {
    try {
      switch (uri) {
        case 'ticktick://tasks/today': {
          const tasks = await this.api.getTodayTasks();
          return {
            success: true,
            data: tasks,
            metadata: {
              count: tasks.length,
              date: new Date().toISOString().split('T')[0],
              type: 'today_tasks',
            },
          };
        }

        case 'ticktick://tasks/overdue': {
          const tasks = await this.api.getOverdueTasks();
          return {
            success: true,
            data: tasks,
            metadata: {
              count: tasks.length,
              type: 'overdue_tasks',
            },
          };
        }

        case 'ticktick://tasks/upcoming': {
          const today = new Date();
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          const tasks = await this.api.getTasks({
            startDate: today.toISOString().split('T')[0],
            endDate: nextWeek.toISOString().split('T')[0],
            completed: false,
          });
          
          return {
            success: true,
            data: tasks,
            metadata: {
              count: tasks.length,
              startDate: today.toISOString().split('T')[0],
              endDate: nextWeek.toISOString().split('T')[0],
              type: 'upcoming_tasks',
            },
          };
        }

        case 'ticktick://tasks/all': {
          const tasks = await this.api.getTasks();
          return {
            success: true,
            data: tasks,
            metadata: {
              count: tasks.length,
              type: 'all_tasks',
            },
          };
        }

        case 'ticktick://tasks/completed': {
          const tasks = await this.api.getTasks({ completed: true });
          return {
            success: true,
            data: tasks,
            metadata: {
              count: tasks.length,
              type: 'completed_tasks',
            },
          };
        }

        case 'ticktick://tasks/incomplete': {
          const tasks = await this.api.getTasks({ completed: false });
          return {
            success: true,
            data: tasks,
            metadata: {
              count: tasks.length,
              type: 'incomplete_tasks',
            },
          };
        }

        case 'ticktick://projects/all': {
          const projects = await this.api.getProjects();
          return {
            success: true,
            data: projects,
            metadata: {
              count: projects.length,
              type: 'all_projects',
            },
          };
        }

        default:
          // Handle dynamic URIs like ticktick://projects/{projectId}/tasks
          if (uri.startsWith('ticktick://projects/') && uri.endsWith('/tasks')) {
            const projectId = uri.split('/')[2];
            const tasks = await this.api.getTasks({ projectId });
            return {
              success: true,
              data: tasks,
              metadata: {
                count: tasks.length,
                projectId,
                type: 'project_tasks',
              },
            };
          }

          throw new Error(`Unknown resource URI: ${uri}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Helper method to create dynamic project task resources
  createProjectTaskResource(projectId: string, projectName: string): Resource {
    return {
      uri: `ticktick://projects/${projectId}/tasks`,
      name: `${projectName} Tasks`,
      description: `All tasks in the ${projectName} project`,
      mimeType: 'application/json',
    };
  }
}