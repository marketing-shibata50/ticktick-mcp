import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { TickTickAuth } from './auth/ticktick-auth.js';
import { TickTickAPI } from './auth/ticktick-api.js';
import { TaskTools } from './tools/task-tools.js';
import { ProjectTools } from './tools/project-tools.js';
import { TaskResources } from './resources/task-resources.js';
import { PlanningPrompts } from './prompts/planning-prompts.js';
import { TickTickConfig } from './types/ticktick.js';
import { MockTickTickAPI } from './demo/mock-data.js';
import { ConfigManager } from './config/config-manager.js';
import { ITickTickAPI } from './types/api-interface.js';

export class TickTickMCPServer {
  private server: Server;
  private auth: TickTickAuth;
  private api: ITickTickAPI;
  private taskTools: TaskTools;
  private projectTools: ProjectTools;
  private taskResources: TaskResources;
  private planningPrompts: PlanningPrompts;
  private isDemoMode: boolean;
  private configManager: ConfigManager;

  constructor(config: TickTickConfig, demoMode: boolean = false) {
    this.isDemoMode = demoMode;
    this.configManager = ConfigManager.getInstance();
    this.server = new Server({
      name: '@ticktick-ecosystem/mcp-server',
      version: '1.0.0',
    });

    // Initialize TickTick components
    this.auth = new TickTickAuth(config);
    
    if (this.isDemoMode) {
      this.api = new MockTickTickAPI();
    } else {
      this.api = new TickTickAPI(this.auth);
    }
    
    this.taskTools = new TaskTools(this.api);
    this.projectTools = new ProjectTools(this.api);
    this.taskResources = new TaskResources(this.api);
    this.planningPrompts = new PlanningPrompts(this.api);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Tools handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const taskTools = this.taskTools.getTools();
      const projectTools = this.projectTools.getTools();
      
      return {
        tools: [...taskTools, ...projectTools],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Check if user is authenticated (skip for demo mode)
        if (!this.isDemoMode && !this.auth.isAuthenticated()) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  error: '認証が必要です。セットアップを実行してください。',
                  setup_command: 'npx @ticktick-ecosystem/mcp-server --setup',
                  authUrl: this.auth.getAuthorizationUrl(),
                }),
              },
            ],
          };
        }

        // Route to appropriate tool handler
        let result;
        const taskToolNames = this.taskTools.getTools().map(t => t.name);
        const projectToolNames = this.projectTools.getTools().map(t => t.name);

        if (taskToolNames.includes(name)) {
          result = await this.taskTools.handleToolCall(name, args || {});
        } else if (projectToolNames.includes(name)) {
          result = await this.projectTools.handleToolCall(name, args || {});
        } else {
          result = {
            success: false,
            error: `Unknown tool: ${name}`,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }, null, 2),
            },
          ],
        };
      }
    });

    // Resources handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: this.taskResources.getResources(),
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        if (!this.isDemoMode && !this.auth.isAuthenticated()) {
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  success: false,
                  error: '認証が必要です。セットアップを実行してください。',
                  setup_command: 'npx @ticktick-ecosystem/mcp-server --setup',
                }),
              },
            ],
          };
        }

        const result = await this.taskResources.getResourceContent(uri);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    });

    // Prompts handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.planningPrompts.getPrompts(),
      };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!this.isDemoMode && !this.auth.isAuthenticated()) {
          return {
            description: '認証が必要です',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: '認証が必要です。セットアップを実行してください: npx @ticktick-ecosystem/mcp-server --setup',
                },
              },
            ],
          };
        }

        const promptContent = await this.planningPrompts.getPromptContent(name, args || {});
        return {
          description: `TickTick ${name} prompt`,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: promptContent,
              },
            },
          ],
        };
      } catch (error) {
        return {
          description: 'Error generating prompt',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            },
          ],
        };
      }
    });
  }

  async start(): Promise<void> {
    // Use the built-in stdio transport
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  // Helper methods for authentication
  getAuthorizationUrl(): string {
    return this.auth.getAuthorizationUrl();
  }

  async setAuthorizationCode(code: string): Promise<void> {
    await this.auth.exchangeCodeForToken(code);
  }

  setAccessToken(accessToken: string, refreshToken?: string): void {
    this.auth.setAccessToken(accessToken, refreshToken);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}