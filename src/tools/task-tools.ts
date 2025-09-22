import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { ITickTickAPI } from '../types/api-interface.js';

// Zod schemas for tool arguments validation
const CreateTaskSchema = z.object({
  title: z.string().describe('Title of the task'),
  content: z.string().optional().describe('Description or content of the task'),
  dueDate: z.string().optional().describe('Due date in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)'),
  priority: z.number().min(0).max(5).optional().describe('Priority level (0=None, 1=Low, 3=Medium, 5=High)'),
  projectId: z.string().optional().describe('ID of the project to add task to'),
  tags: z.array(z.string()).optional().describe('Array of tags for the task'),
  allDay: z.boolean().optional().describe('Whether this is an all-day task'),
});

const UpdateTaskSchema = z.object({
  taskId: z.string().describe('ID of the task to update'),
  title: z.string().optional().describe('New title for the task'),
  content: z.string().optional().describe('New description or content'),
  dueDate: z.string().optional().describe('New due date in ISO format'),
  priority: z.number().min(0).max(5).optional().describe('New priority level'),
  projectId: z.string().optional().describe('New project ID'),
  tags: z.array(z.string()).optional().describe('New tags array'),
  allDay: z.boolean().optional().describe('Whether this is an all-day task'),
});

const GetTasksSchema = z.object({
  projectId: z.string().optional().describe('Filter tasks by project ID'),
  completed: z.boolean().optional().describe('Filter by completion status'),
  limit: z.number().optional().describe('Maximum number of tasks to return'),
  startDate: z.string().optional().describe('Start date filter (YYYY-MM-DD)'),
  endDate: z.string().optional().describe('End date filter (YYYY-MM-DD)'),
});

const TaskIdSchema = z.object({
  taskId: z.string().describe('ID of the task'),
});

const SearchTasksSchema = z.object({
  query: z.string().describe('Search query for task title or content'),
  limit: z.number().optional().describe('Maximum number of results to return'),
});

export class TaskTools {
  constructor(private api: ITickTickAPI) {}

  getTools(): Tool[] {
    return [
      {
        name: 'create_task',
        description: 'Create a new task in TickTick',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the task',
            },
            content: {
              type: 'string',
              description: 'Description or content of the task',
            },
            dueDate: {
              type: 'string',
              description: 'Due date in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
            },
            priority: {
              type: 'number',
              description: 'Priority level (0=None, 1=Low, 3=Medium, 5=High)',
              minimum: 0,
              maximum: 5,
            },
            projectId: {
              type: 'string',
              description: 'ID of the project to add task to',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of tags for the task',
            },
            allDay: {
              type: 'boolean',
              description: 'Whether this is an all-day task',
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'get_tasks',
        description: 'Get tasks with optional filtering',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Filter tasks by project ID',
            },
            completed: {
              type: 'boolean',
              description: 'Filter by completion status',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of tasks to return',
            },
            startDate: {
              type: 'string',
              description: 'Start date filter (YYYY-MM-DD)',
            },
            endDate: {
              type: 'string',
              description: 'End date filter (YYYY-MM-DD)',
            },
          },
          required: [],
        },
      },
      {
        name: 'update_task',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: 'ID of the task to update',
            },
            title: {
              type: 'string',
              description: 'New title for the task',
            },
            content: {
              type: 'string',
              description: 'New description or content',
            },
            dueDate: {
              type: 'string',
              description: 'New due date in ISO format',
            },
            priority: {
              type: 'number',
              description: 'New priority level',
              minimum: 0,
              maximum: 5,
            },
            projectId: {
              type: 'string',
              description: 'New project ID',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'New tags array',
            },
            allDay: {
              type: 'boolean',
              description: 'Whether this is an all-day task',
            },
          },
          required: ['taskId'],
        },
      },
      {
        name: 'complete_task',
        description: 'Mark a task as completed',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: 'ID of the task to complete',
            },
          },
          required: ['taskId'],
        },
      },
      {
        name: 'delete_task',
        description: 'Delete a task',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: 'ID of the task to delete',
            },
          },
          required: ['taskId'],
        },
      },
      {
        name: 'get_today_tasks',
        description: 'Get all tasks scheduled for today',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_overdue_tasks',
        description: 'Get all overdue tasks',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'search_tasks',
        description: 'Search tasks by title or content',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for task title or content',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return',
            },
          },
          required: ['query'],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any): Promise<any> {
    try {
      switch (name) {
        case 'create_task': {
          const validated = CreateTaskSchema.parse(args);
          const task = await this.api.createTask(validated);
          return {
            success: true,
            task,
            message: `Task "${task.title}" created successfully`,
          };
        }

        case 'get_tasks': {
          const validated = GetTasksSchema.parse(args);
          const tasks = await this.api.getTasks(validated);
          return {
            success: true,
            tasks,
            count: tasks.length,
          };
        }

        case 'update_task': {
          const validated = UpdateTaskSchema.parse(args);
          const { taskId, ...updateData } = validated;
          const task = await this.api.updateTask({ id: taskId, ...updateData });
          return {
            success: true,
            task,
            message: `Task "${task.title}" updated successfully`,
          };
        }

        case 'complete_task': {
          const validated = TaskIdSchema.parse(args);
          const task = await this.api.completeTask(validated.taskId);
          return {
            success: true,
            task,
            message: `Task completed successfully`,
          };
        }

        case 'delete_task': {
          const validated = TaskIdSchema.parse(args);
          await this.api.deleteTask(validated.taskId);
          return {
            success: true,
            message: `Task deleted successfully`,
          };
        }

        case 'get_today_tasks': {
          const tasks = await this.api.getTodayTasks();
          return {
            success: true,
            tasks,
            count: tasks.length,
            date: new Date().toISOString().split('T')[0],
          };
        }

        case 'get_overdue_tasks': {
          const tasks = await this.api.getOverdueTasks();
          return {
            success: true,
            tasks,
            count: tasks.length,
          };
        }

        case 'search_tasks': {
          const validated = SearchTasksSchema.parse(args);
          const tasks = await this.api.searchTasks(validated.query);
          
          // Apply limit if specified
          const limitedTasks = validated.limit 
            ? tasks.slice(0, validated.limit) 
            : tasks;
            
          return {
            success: true,
            tasks: limitedTasks,
            count: limitedTasks.length,
            query: validated.query,
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}