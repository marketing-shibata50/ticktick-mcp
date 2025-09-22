import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { ITickTickAPI } from '../types/api-interface.js';

// Zod schemas for tool arguments validation
const CreateProjectSchema = z.object({
  name: z.string().describe('Name of the project'),
  color: z.string().optional().describe('Color of the project (hex code or color name)'),
  groupId: z.string().optional().describe('ID of the group to add project to'),
});

const UpdateProjectSchema = z.object({
  projectId: z.string().describe('ID of the project to update'),
  name: z.string().optional().describe('New name for the project'),
  color: z.string().optional().describe('New color for the project'),
});

const ProjectIdSchema = z.object({
  projectId: z.string().describe('ID of the project'),
});

export class ProjectTools {
  constructor(private api: ITickTickAPI) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_projects',
        description: 'Get all projects',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_project',
        description: 'Get a specific project by ID',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'ID of the project to retrieve',
            },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'create_project',
        description: 'Create a new project',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the project',
            },
            color: {
              type: 'string',
              description: 'Color of the project (hex code or color name)',
            },
            groupId: {
              type: 'string',
              description: 'ID of the group to add project to',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'update_project',
        description: 'Update an existing project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'ID of the project to update',
            },
            name: {
              type: 'string',
              description: 'New name for the project',
            },
            color: {
              type: 'string',
              description: 'New color for the project',
            },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'delete_project',
        description: 'Delete a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'ID of the project to delete',
            },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'get_project_tasks',
        description: 'Get all tasks in a specific project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'ID of the project',
            },
            completed: {
              type: 'boolean',
              description: 'Filter by completion status',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of tasks to return',
            },
          },
          required: ['projectId'],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any): Promise<any> {
    try {
      switch (name) {
        case 'get_projects': {
          const projects = await this.api.getProjects();
          return {
            success: true,
            projects,
            count: projects.length,
          };
        }

        case 'get_project': {
          const validated = ProjectIdSchema.parse(args);
          const project = await this.api.getProject(validated.projectId);
          return {
            success: true,
            project,
          };
        }

        case 'create_project': {
          const validated = CreateProjectSchema.parse(args);
          const project = await this.api.createProject(validated);
          return {
            success: true,
            project,
            message: `Project "${project.name}" created successfully`,
          };
        }

        case 'update_project': {
          const validated = UpdateProjectSchema.parse(args);
          const { projectId, ...updateData } = validated;
          const project = await this.api.updateProject(projectId, updateData);
          return {
            success: true,
            project,
            message: `Project "${project.name}" updated successfully`,
          };
        }

        case 'delete_project': {
          const validated = ProjectIdSchema.parse(args);
          await this.api.deleteProject(validated.projectId);
          return {
            success: true,
            message: `Project deleted successfully`,
          };
        }

        case 'get_project_tasks': {
          const validated = z.object({
            projectId: z.string(),
            completed: z.boolean().optional(),
            limit: z.number().optional(),
          }).parse(args);
          
          const tasks = await this.api.getTasks({
            projectId: validated.projectId,
            completed: validated.completed,
            limit: validated.limit,
          });
          
          return {
            success: true,
            tasks,
            count: tasks.length,
            projectId: validated.projectId,
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