import { Prompt } from '@modelcontextprotocol/sdk/types.js';
import { ITickTickAPI } from '../types/api-interface.js';

export class PlanningPrompts {
  constructor(private api: ITickTickAPI) {}

  getPrompts(): Prompt[] {
    return [
      {
        name: 'daily_planning',
        description: 'Help plan your daily tasks and priorities',
        arguments: [
          {
            name: 'focus_areas',
            description: 'Specific areas or projects to focus on today',
            required: false,
          },
          {
            name: 'available_hours',
            description: 'Number of available working hours today',
            required: false,
          },
        ],
      },
      {
        name: 'task_breakdown',
        description: 'Break down a complex task into smaller, manageable subtasks',
        arguments: [
          {
            name: 'main_task',
            description: 'The main task or project to break down',
            required: true,
          },
          {
            name: 'deadline',
            description: 'Deadline for the main task',
            required: false,
          },
          {
            name: 'complexity',
            description: 'Complexity level (simple, medium, complex)',
            required: false,
          },
        ],
      },
      {
        name: 'priority_analysis',
        description: 'Analyze and suggest priorities for your current tasks',
        arguments: [
          {
            name: 'project_filter',
            description: 'Filter analysis to specific project',
            required: false,
          },
          {
            name: 'time_frame',
            description: 'Time frame for analysis (today, week, month)',
            required: false,
          },
        ],
      },
      {
        name: 'weekly_review',
        description: 'Review your productivity and plan for the upcoming week',
        arguments: [
          {
            name: 'goals',
            description: 'Specific goals for the upcoming week',
            required: false,
          },
        ],
      },
      {
        name: 'project_planning',
        description: 'Create a comprehensive plan for a new project',
        arguments: [
          {
            name: 'project_name',
            description: 'Name of the new project',
            required: true,
          },
          {
            name: 'project_scope',
            description: 'Scope and objectives of the project',
            required: true,
          },
          {
            name: 'timeline',
            description: 'Expected timeline for the project',
            required: false,
          },
        ],
      },
    ];
  }

  async getPromptContent(name: string, args: Record<string, string> = {}): Promise<string> {
    try {
      switch (name) {
        case 'daily_planning': {
          const todayTasks = await this.api.getTodayTasks();
          const overdueTasks = await this.api.getOverdueTasks();
          
          let prompt = `# Daily Planning Assistant

## Today's Current Tasks (${todayTasks.length})
${todayTasks.map(task => `- ${task.title}${task.priority ? ` (Priority: ${task.priority})` : ''}`).join('\n')}

## Overdue Tasks (${overdueTasks.length})
${overdueTasks.map(task => `- ${task.title} (Due: ${task.dueDate})`).join('\n')}

## Planning Guidance
Based on your current tasks, please help me:
1. Prioritize today's tasks effectively
2. Allocate time for each priority task
3. Handle overdue items appropriately
4. Maintain a healthy work-life balance

`;

          if (args.focus_areas) {
            prompt += `## Focus Areas\nToday I want to focus on: ${args.focus_areas}\n\n`;
          }

          if (args.available_hours) {
            prompt += `## Available Time\nI have ${args.available_hours} hours available for work today.\n\n`;
          }

          prompt += `Please provide a structured daily plan with time allocations and priority recommendations.`;

          return prompt;
        }

        case 'task_breakdown': {
          const mainTask = args.main_task;
          const deadline = args.deadline || 'No specific deadline';
          const complexity = args.complexity || 'medium';

          return `# Task Breakdown Assistant

## Main Task
**Task:** ${mainTask}
**Deadline:** ${deadline}
**Complexity Level:** ${complexity}

## Breakdown Request
Please help me break down this task into smaller, actionable subtasks that are:
1. Specific and measurable
2. Appropriately sized (2-4 hours each)
3. Logically sequenced
4. Realistic given the deadline

## Output Format
Please provide:
- [ ] Subtask 1 (estimated time)
- [ ] Subtask 2 (estimated time)
- [ ] Subtask 3 (estimated time)
...

Include dependencies between tasks and suggest which subtasks could be done in parallel.`;
        }

        case 'priority_analysis': {
          const incompleteTasks = await this.api.getTasks({ completed: false });
          const timeFrame = args.time_frame || 'week';
          
          let filteredTasks = incompleteTasks;
          if (args.project_filter) {
            filteredTasks = incompleteTasks.filter(task => 
              task.projectId === args.project_filter
            );
          }

          return `# Priority Analysis Assistant

## Current Tasks for Analysis (${filteredTasks.length})
${filteredTasks.map(task => 
            `- ${task.title}${task.dueDate ? ` (Due: ${task.dueDate})` : ''}${task.priority ? ` (Priority: ${task.priority})` : ''}`
          ).join('\n')}

## Analysis Request
Please analyze these tasks for the ${timeFrame} and provide:

1. **High Priority** - Tasks that should be done first
2. **Medium Priority** - Tasks that are important but not urgent
3. **Low Priority** - Tasks that can be deferred if needed

## Criteria for Analysis
Consider:
- Due dates and deadlines
- Task complexity and time requirements
- Dependencies between tasks
- Impact on other projects or people
- Personal/professional goals

Please provide specific recommendations for task sequencing and time management.`;
        }

        case 'weekly_review': {
          const completedTasks = await this.api.getTasks({ completed: true });
          const incompleteTasks = await this.api.getTasks({ completed: false });
          
          // Filter for tasks from the past week
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          
          const recentCompleted = completedTasks.filter(task => 
            task.completedTime && new Date(task.completedTime) >= weekAgo
          );

          return `# Weekly Review Assistant

## This Week's Accomplishments (${recentCompleted.length})
${recentCompleted.map(task => `- ✅ ${task.title}`).join('\n')}

## Pending Tasks (${incompleteTasks.length})
${incompleteTasks.slice(0, 10).map(task => `- ⏳ ${task.title}`).join('\n')}
${incompleteTasks.length > 10 ? `... and ${incompleteTasks.length - 10} more` : ''}

## Review Questions
Please help me reflect on:
1. What went well this week?
2. What challenges did I face?
3. How can I improve my productivity next week?
4. Which pending tasks should be prioritized?

${args.goals ? `## Goals for Next Week\n${args.goals}\n\n` : ''}

Please provide a comprehensive weekly review with actionable insights for improvement.`;
        }

        case 'project_planning': {
          const projects = await this.api.getProjects();
          const projectName = args.project_name;
          const projectScope = args.project_scope;
          const timeline = args.timeline || 'To be determined';

          return `# Project Planning Assistant

## New Project Details
**Project Name:** ${projectName}
**Scope:** ${projectScope}
**Timeline:** ${timeline}

## Existing Projects (${projects.length})
${projects.map(project => `- ${project.name}`).join('\n')}

## Planning Request
Please help me create a comprehensive project plan including:

1. **Project Breakdown Structure**
   - Major phases or milestones
   - Key deliverables
   - Dependencies and risks

2. **Task Planning**
   - Specific actionable tasks
   - Time estimates
   - Resource requirements

3. **Timeline and Scheduling**
   - Project phases with dates
   - Critical path identification
   - Buffer time for uncertainties

4. **Integration Considerations**
   - How this project fits with existing projects
   - Resource allocation
   - Potential conflicts or synergies

Please provide a structured project plan that I can implement in TickTick.`;
        }

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    } catch (error) {
      return `Error generating prompt: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}